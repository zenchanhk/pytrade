
//import * as moment from 'moment';
import Status from './status';

const NOT_FOUND = 'No symbol found';
const DISCONNECTED = 'No connection';

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
    actions.fillHidData({commit}, {data: d});
} 

function errorCallback(data) {
    var d = data ? JSON.parse(data) : '';
    actions.handleError({commit}, {data: d});
} 

// initial state
const state = {
    codes: {'s1': '', 's2': ''}, //value are strings get from search box
    selected: {'s1': null, 's2': null}, //value are contract; selected symbols 
    details: {'s1': NOT_FOUND, 's2': NOT_FOUND}, //values are objects containing contract details
    delayedConIds: new Set(),
    tickers: {}, // dictionary to store tick data, conId as key
    bars: {},   //store historical data bars
    order: {'s1': {contract: null, mktData: null}, 's2': {contract: null, mktData: null}},  //values are objects containing real time data
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
    setErrorCallback({ commit }) {
        setCommit(commit);
        // eslint-disable-next-line
        symbol.setErrorCallback('', errorCallback);
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
                state.tickers[x.contract.conId] = x;   
                var tmp = Object.assign({}, state.tickers);
                state.tickers = tmp;
            });
        }        
    },
    removeTicker(state, {contract}) {
        delete state.tickers[contract.conId];
    },
    fillHisData(state, {data}) {
        //console.log('fillTicker(commit):');
        //console.log(data[0].last);
        state.bars[data[0].contract.conId] = data;
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
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};