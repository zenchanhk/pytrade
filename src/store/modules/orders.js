import Contract from './symbols';
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
    cancellableStatus: ['PreSubmitted', 'PendingSubmit', 'Submitted'],
    completeStatus: ['Cancelled', 'Filled'],
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
    trades: {},
    pairs: {}, //time will be the key
    errors: {}
};

// actions
const actions = {    
    setCallbacks({ commit }) {
        setCommit(commit);
        // eslint-disable-next-line
        order.setStatusCallback('', statusCallback);
        // eslint-disable-next-line
        order.setErrorCallback('', errorCallback);
    },
    placeOrders({ state }) {
        var orders = [];
        for (let i = 1; i <= Object.keys(Contract.state.selected).length; i++) {
            const c = Contract.state.selected['s' + i];
            const lots = state.lots['s' + i];
            const action = state.actions[state.dirs['s' + i]];
            if (c && c.conId && lots > 0) {
                orders.push({contract: c, order: `MarketOrder('${action}', ${lots})`});
            }
        }
        if (orders.length > 0) {
            // eslint-disable-next-line
            order.placeOrder(JSON.stringify(orders));
        }        
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
        console.log(status);
        //calculate commissions
        for (let i = 0; i < status.trade.fills.length; i++) {
            const f = status.trade.fills[i];
            if (f.commissionReport && f.commissionReport.commission) {
                status.trade.commission = f.commissionReport.commission;
                status.trade.comcur = f.commissionReport.currency;
            }            
        }
        Vue.set(state.trades, status.trade.contract.conId, status);
        //notify observers that order status changed
        if (obs.length > 0) {
            obs.forEach(x => x({trade: status.trade, changed: 'status'}));
        }
    },
    fillError(state, {error}) {
        Vue.set(state.errors, error.conId, error.msg);
        //notify observers that order status changed
        if (obs.length > 0) {
            obs.forEach(x => x({id: error.conId, error: error.msg, changed: 'error'}));
        }
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
        var s1 = Contract.state.selected['s1'];
        var s2 = Contract.state.selected['s2'];
        if (s1 && s2) {
            var t1 = Contract.state.tickers[s1.conId];
            var t2 = Contract.state.tickers[s2.conId];
            if (t1 && t2) {
                var p1 = t1.last ? t1.last : t1.marketPrice;
                var p2 = t2.last ? t2.last : t2.marketPrice;
                p1 = s1.multiplier ? p1 * s1.multiplier : p1;
                p2 = s2.multiplier ? p2 * s2.multiplier : p2;

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
    mutations,
    addObserver,
    removeObserver
};