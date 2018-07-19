
// initial state

const state = {
    posX: 2,
    posY: 2,
    ports: {},
    lotslinked: true,
    dirlinked: true,
};

// actions
const actions = {
    changeToolbarXY({commit}, {x, y}) {
        commit('changeToolbarXY', {x, y});
    },
    save({data}) {
        // eslint-disable-next-line
        config.save(data);
    },
    read() { 
        // eslint-disable-next-line
        config.read(dummy, statusCallback)
    }
};

//getters
const getters = {

};

// mutations
const mutations = {
    
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};