
//import * as moment from 'moment';
//import Status from './status';
import Orders from './orders';
import Vue from 'vue';
//import { stat } from 'fs';

const NOT_FOUND = 'No symbol found';
//const DISCONNECTED = 'No connection';

var commit = null;

function setCommit(c) {
    commit = c;
}

function mktDataCallback(data) {
    data = data.replace(/nan/ig, 'null');
    var d = data ? JSON.parse(data) : '';
    actions.fillTickers({commit}, {data: d});
} 

function hisDataCallback(data) {
    data = data.replace(/nan/ig, 'null');
    var d = data ? JSON.parse(data) : '';
    actions.fillHisData({commit}, {data: d});
} 

/* {'contract': contract, 'error': errorString} */
function errorCallback(data) {
    var d = data ? JSON.parse(data) : '';
    actions.handleError({commit}, {data: d});
} 

function updateOrderStatus({ id, trade, error, changed }) {
    actions.updateOrderStatus({commit}, { id, trade, error, changed });
}

// initial state
const state = {
    codes: {'s1': '', 's2': ''}, //value are strings get from search box
    selected: {'s1': null, 's2': null}, //value are contract and trade status; selected symbols 
    details: {'s1': NOT_FOUND, 's2': NOT_FOUND}, //values are objects containing contract details
    delayedConIds: new Set(),
    tickers: {}, // dictionary to store tick data, conId as key
    bars: {},   //store historical data bars
    errors: {},
    trades: {},  //values are trades
    tradeErr: {}
};

//getters
const getters = {
    selected: (state) => (id) => {
        return state.selected[id];
    },
    s1: (state) => state.selected['s1'],
    s2: (state) => state.selected['s2'],
    getCurItem: (state) => (id) => {
        console.log('id:' + id);
        return state.codes[id];
    },
    //id must be conId
    getHisData: (state) => (id) => {        
        return state.bars[id];
    },
    //ids should be contract objects with conId
    getMktData: (state) => {
        //console.log('getMktData:');
        var result = [];
        var ids = getters.getSelectedItems(state);
        if (Object.prototype.toString.call(ids) === '[object Array]' && ids.length > 0) {
            ids.forEach((x) => {
                if (state.tickers[x.conId]) {
                    //append error msg if any
                    if (state.errors[x.conId]) {
                        state.tickers[x.conId]['error'] = state.errors[x.conId];
                    }
                    if (state.tradeErr[x.conId]) {
                        state.tickers[x.conId]['error'] = state.tradeErr[x.conId];
                    }
                    if (state.trades[x.conId]) {
                        state.tickers[x.conId]['trade'] = state.trades[x.conId];
                        //messages from log
                        var msgs = [];
                        for (var l in state.trades[x.conId].log) {
                            if (l.message) {
                                msgs.push(l.message);
                            }                        
                        }
                        if (msgs.length) {
                            state.tickers[x.conId]['messages'] = msgs;
                        }
                    }                    
                    result.push(state.tickers[x.conId]);
                } else {
                    console.error('Cannot find symbol in tickers');
                }                   
            });
        }    
        /*
        if (result.length == 1) {
            console.log(result[0].contract.conId + ':' + result[0].last)
        }
        if (result.length == 2) {
            console.log(result[1].contract.conId + ':' + result[1].last)
        }*/
        return result;
    },
    //get symbol details
    //id must be 's1' or 's2'
    getData: (state) => (id) => {
        return state.details[id];
    },
    getSelectedItems: (state) => {
        var result = [];
        if (state.selected.s1)
            result.push(state.selected.s1);
        if (state.selected.s2)
            result.push(state.selected.s2);
          
        return result;
    },
};

// actions
const actions = {
    fillTickers({ commit }, {data}) {
        //console.log(commit);
        //console.log(data);
        commit('fillTickers', {data});
    },
    fillHisData({ commit }, {data}) {
        commit('fillHisData', {data});
    },
    setCallbacks({ commit }) {
        setCommit(commit);
        // eslint-disable-next-line
        symbol.setErrorCallback('', errorCallback);
        // eslint-disable-next-line
        symbol.setHisDataCallback('', hisDataCallback);
        //add observers to order status change events
        Orders.addObserver(updateOrderStatus);
    },
    updateOrderStatus({ commit }, { id, trade, error, changed }) {
        commit('updateOrderStatus', { id, trade, error, changed });
    },
    handleError({ commit }, {data}) {
        commit('handleError', {data});
    },
    reqContractDetails ({ commit }, {id, code}) {
        console.log('searching ' + code);
        
        return new Promise((resolve, reject) => {
            try {                
                // eslint-disable-next-line
                symbol.getContractDetails(code, (details) => {
                    commit('fillContractDetails', {id: id, details: details ? JSON.parse(details) : null });                        
                    resolve(true);
                });
            } catch (err) {
                reject(err);
            }            
        });        
    },
    // eslint-disable-next-line
    reqMktData({ commit, state }, {contract, selectedItem}) {
        //console.log('reqMktData:');
        //console.log(contract);

        //remove old symbol request first
        var item = {};
        item.id = selectedItem.id;
        item.value = state.selected[item.id];
        actions.cancelMktData({commit}, {selectedItem: item});

        if (selectedItem) {
            commit('fillSelectedItem', {item: selectedItem});
            //console.log(state.selected);
        }
        setCommit(commit);
        // eslint-disable-next-line
        symbol.subMktData(contract.conId, mktDataCallback);
        //console.log('out of reqMktData:');
    },
    cancelMktData({ commit }, {selectedItem}) {
        if (selectedItem.value) {
            commit('fillSelectedItem', {item: {id: selectedItem.id, value: null}});
            commit('removeTicker', {contract: selectedItem.value});
            if (selectedItem.value && selectedItem.value.conId) {
                // eslint-disable-next-line
                symbol.unsubMktData(selectedItem.value.conId);
            }     
        }           
    }
};

// mutations
const mutations = {
    updateOrderStatus(state, { id, trade, error, changed }) {
        //get all conIds from selected
        if (!id && trade) id = trade.contract.conId;
        //search in selected dict
        var idx = -1;
        Object.keys(state.selected).forEach(key => {
            if (state.selected[key] && id) {
                if (id == state.selected[key].conId) {
                    idx = key;
                }
            }
        });        

        if (changed == 'status') {
            Vue.set(state.trades, id, trade);
            //attach trade to selected            
            if (idx != -1) {
                state.selected[idx]['trade'] = trade;
                Vue.set(state.selected, idx, state.selected[idx]);                
            }
        } else if (changed == 'error') {
            Vue.set(state.tradeErr, id, error);            
        }   
        Vue.set(state.tickers, id, state.tickers[id]);     
        console.log(state.tickers);
    },
    fillContractDetails (state, {id, details}) {        
        if (details) {
            state.details[id] = details;
        }            
        else
            state.details[id] = NOT_FOUND;
        console.log(details);
    },
    fillTickers(state, {data}) {
        //console.log('fillTicker(commit):');
        //console.log(data[0].last);
        if (data.length > 0) {
            data.forEach((x) => {
                Vue.set(state.tickers, x.contract.conId, x);
            });
        }        
    },
    removeTicker(state, {contract}) {
        delete state.tickers[contract.conId];
    },
    fillHisData(state, {data}) {
        //console.log('fillTicker(commit):');
        //console.log(data[0].last);
        Vue.set(state.bars, data[0].contract.conId, data);
    },
    fillSelectedItem(state, {item}) {
        state.selected[item.id] = item.value;
    },
    handleError(state, {data}) {    
        console.log('commit.handleError:');    
        console.log(data);
        Object.keys(state.selected).forEach((key) => {
            var value = state.selected[key];
            if (value && value.conId == data.contract.conId) {
                value.delayedMktData = true;
            }
        });
        Vue.set(state.errors, data.contract.conId, data.error);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};