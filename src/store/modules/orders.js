import Symbol from './symbols';
import Vue from 'vue';

var commit = null;
var obs = [];

function addObserver(ob) {
    obs.push(ob);
}

function removeObserver(ob) {
    var i = obs.indexOf(ob);
    if (i >= 0)
        obs.splice(i);
}

function setCommit(c) {
    commit = c;
}

function statusCallback(data) {
    data = data.replace(/nan/ig, 'null');
    var d = data ? JSON.parse(data) : '';
    actions.fillStatus({commit}, {status: d});
} 

function errorCallback(e) {
    e = e.replace(/nan/ig, 'null');
    var d = e ? JSON.parse(e) : '';
    actions.fillError({commit}, {error: d});
} 

// initial state
const state = {
    lots: {s1: 0, s2: 0},
    dirs: {s1: 0, s2: 1},
    orderTypes: {
        0: 'MarketOrder',
        1: 'LimitOrder',
        2: 'StopOrder',
        3: 'StopLimitOrder'
    },
    actions: {
        0: 'BUY',
        1: 'SELL'
    },
    orders: {},
    pairs: {},
    errors: {}
};

// actions
const actions = {    
    setCallbacks() {
        setCommit(commit);
        // eslint-disable-next-line
        order.set('setStatusCallback', statusCallback);
        // eslint-disable-next-line
        order.set('setErrorCallback', errorCallback);
    },
    placeOrders({ state }) {
        var orders = []
        for (let i = 0; i < Symbol.state.selected.length; i++) {
            const c = Symbol.state.selected['s' + i];
            const lots = state.lots['s' + i];
            const action = state.actions[state.dirs['s' + i]]
            if (c && c.conId && lots > 0) {
                orders.append({contract: c, order: `MarketOrder('${action}', lots)`});
            }
        }
        // eslint-disable-next-line
        order.placeOrder(JSON.stringify(orders));
    },
    cancelOrder(contract) {
        if (contract) {
            // eslint-disable-next-line
            order.cancelOrder(contract);
        } else {
            // eslint-disable-next-line
            order.cancelOrder();
        }
    },
    fillStatus({ commit }, {status}) {
        commit('fillStatus', {status});
    },
    fillError({ commit }, {error}) {
        commit('fillError', {error});
    },
    save({data}) {
        // eslint-disable-next-line
        config.save(data);
    },
    changeDir({ commit }, {id, dir}) { 
        commit('changeDir', {id, dir});
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
    fillStatus(state, {status}) {
        var s = JSON.parse(status);
        switch (s.status) {
            case 'modifying':
                
                break;        
            case 'cancelling':
                
                break; 
            case 'cancelled':
                
                break;  
            case 'filling':
                
                break;
            case 'filled':
                
                break;                
        }
        //notify observers that order status changed
        if (obs.length > 0) {
            obs.forEach(x => x());
        }
    },
    fillError(state, {error}) {
        Vue.set(state.errors, error.contract.conId, error.error);
    },
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
    changeDir(state, {id, dir}) { 
        state.dirs[id] = dir;
    },
    changeLots(state, {id, lots}) { 
        state.lots[id] = lots;
    },
    calLinkedLots(state, {id}) { 
        var s1 = Symbol.state.selected['s1'];
        var s2 = Symbol.state.selected['s2'];
        if (s1 && s2) {
            var t1 = Symbol.state.tickers[s1.conId];
            var t2 = Symbol.state.tickers[s2.conId];
            if (t1 && t2) {
                var p1 = t1.last ? t1.last : t1.marketPrice;
                var p2 = t2.last ? t2.last : t2.marketPrice;

                var linkedId = '';
                if (id == 's1' && p1 > 0 && p2 > 0) {
                    linkedId = 's2'; 
                    state.lots[linkedId] = Math.round(p1 * state.lots['s1'] / p2);
                } else if (id == 's2' && p1 > 0 && p2 > 0) {
                    linkedId = 's1';
                    state.lots[linkedId] = Math.round(p2 * state.lots['s2'] / p1);
                }
            }              
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