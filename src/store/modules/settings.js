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
    async asyncSave({ commit }, {cfg}) {
        /* cfg should include section */
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line
            config.saveAppCfg(cfg, (result) => {
                if (result == 'OK') {                    
                    commit('changeSettings', {data: cfg});
                    resolve(true);
                }                    
                else
                    reject(false);
            });
        });        
    },
    read({commit}) { 
        // eslint-disable-next-line
        config.readAppCfg(sections, (result) => {
            commit('readSettings', {data: result});
        });
    }
};

//getters
const getters = {
    posX: state => {
        //console.log('posX');
        //console.log(parseInt(state.toolbar.posX));
        return parseInt(state.toolbar.posX);
    },
    posY: state => {
        return parseInt(state.toolbar.posY);
        //return 100;
    },
    lotslinked: state => {
        return typeof(state.link.lotslinked) == typeof(true) ? state.link.lotslinked 
            : state.link.lotslinked.toLowerCase() == 'true';
    },
    dirlinked: state => {
        return typeof(state.link.dirlinked) == typeof(true) ? state.link.dirlinked 
            : state.link.dirlinked.toLowerCase() == 'true';
    }
};

// mutations
const mutations = {
    readSettings(state, {data}) {
        data = JSON.parse(data);
        for (let i = 0; i < data.length; i++) {
            state[sections[i]] = data[i];
        }
        //console.log(state);
    },
    changeSettings(state, {data}) {
        Object.assign(state, JSON.parse(data));
        state = Object.assign({}, state);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};