import Symbol from './symbols';
// initial state

const state = {
    lots: {s1: 0, s2: 0},
    dirs: {s1: 0, s2: 1},
    status: {s1: '', s2: ''}
};

// actions
const actions = {    
    save({data}) {
        // eslint-disable-next-line
        config.save(data);
    },
    //swap directions
    swap({ commit }) { 
        commit('swap');
    },
    changeLots({ commit }, {id, lots}) { 
        commit('changeLots', {id, lots});
    },
    calLinkedLots({ commit }, {id}) { 
        commit('calLinkedLots', {id});
    },
    clear({ commit }) {
        commit('clear');
    }
};

//getters
const getters = {
    lots1: state => {
        return state.lots.s1;
    },
    lots2: state => {
        return state.lots.s2;
    },
    dir1: state => {
        return state.dirs.s1;
    },
    dir2: state => {
        return state.dirs.s2;
    },
};

// mutations
const mutations = {
    clear(state) {
        state.lots.s1 = 0;
        state.lots.s2 = 0;
        state.dirs.s1 = 0;
        state.dirs.s2 = 1;
    },
    swap(state) {        
        Object.keys(state.dirs).forEach(key => {
            state.dirs[key] = (state.dirs[key] + 1) % 2; 
        });  
    },
    changeLots(state, {id, lots}) { 
        state.lots[id] = lots;
    },
    calLinkedLots(state, {id}) { 
        var t1 = Symbol.state.tickers[Symbol.state.selected['s1'].conId];
        var t2 = Symbol.state.tickers[Symbol.state.selected['s2'].conId];
        var p1 = t1.last ? t1.last : t1.marketPrice;
        var p2 = t2.last ? t2.last : t2.marketPrice;

        var linkedId = '';
        if (id == 's1') {
            linkedId = 's2'; 
            state.lots[linkedId] = p1 * state.lots['s1'] / p2;
        } else {
            linkedId = 's1';
            state.lots[linkedId] = p2 * state.lots['s2'] / p1;
        }         
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};