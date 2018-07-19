// initial state

const state = {
    toolbar: {
        posX: 2,
        posY: 2,
    },
    ib: {
        ports: {},
    },
    link: {
        lotslinked: true,
        dirlinked: true,
    }    
};

const sections = ['link','ib','toolbar'];
// actions
const actions = {
    save({section, cfg}) {
        // eslint-disable-next-line
        config.saveAppCfg(section, cfg);
    },
    async asyncSave({section, cfg}) {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line
            config.saveAppCfg(section, cfg, (result) => {
                if (result == 'OK')
                    resolve(true);
                else
                    reject(false);
            });
        });        
    },
    read({commit}) { 
        // eslint-disable-next-line
        config.readAppCfg(sections, (result) => {
            //console.log('readsettings:');
            //console.log(result);
            commit('readSettings', {data: result});
        });
    }
};

//getters
const getters = {
    posX: state => {
        console.log('posX');
        console.log(parseInt(state.toolbar.posX));
        return parseInt(state.toolbar.posX);
    },
    posY: state => {
        return parseInt(state.toolbar.posY);
        //return 100;
    },
    lotslinked: state => {
        return state.link.lotslinked;
    },
    dirlinked: state => {
        return state.link.dirlinked;
    }
};

// mutations
const mutations = {
    readSettings(state, {data}) {
        data = JSON.parse(data);
        for (let i = 0; i < data.length; i++) {
            state[sections[i]] = data[i];
        }
        console.log(state);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};