
var commit = null;
function setCommit(c) {
    commit = c;
}
function statusCallback(status) {
    console.log(status);
    actions.changeStatus({commit}, {data: status});       
}

// initial state
const state = {
    connected: false,
    server_connected: false,
    lan_connected: false,
    action: {action: -1, desc: '', timer: null},
    //timer: 0,
    //description: '',
    status: {},
    account: 'DISCONNECTED',
};

// actions
const actions = {
    setCallback({commit}) { 
        setCommit(commit);
        // eslint-disable-next-line
        ibcon.getStatus('', statusCallback);
    },
    changeStatus({commit}, {data}) {
        //console.log(state);
        commit('changeStatus', {data});
    },
    
};

//getters
const getters = {
    action: state => {
        return state.action.action;
    },
    desc: state => {
        return state.action.desc;
    },
    timer: state => {
        return state.action.timer;
    }
};

// mutations
const mutations = {
    
    changeStatus(state, {data}) {
        //console.log(state.connected);
        var s = JSON.parse(data);
        state.status = s;
        //console.log(s);
        //check if any changes first, to avoid unnecessary UI-refresh and lost focus on current focused element
        if (s.hasOwnProperty('code')) {
            switch (s.code) {
                case 0:
                    if (!state.connected)
                        state.connected = true;
                    if (state.account != s.account)
                        state.account = s.account;
                    break;
                case 1:
                    if (state.connected)
                        state.connected = false;
                    state.account = 'DISCONNECTED';
                    break;
                case 2:
                    if (!state.lan_connected)
                        state.lan_connected = true;
                    break;
                case 3:
                    if (state.lan_connected)
                        state.lan_connected = false;
                    if (state.server_connected)
                        state.server_connected = false;
                    break;
                case 4:
                    if (!state.server_connected)
                        state.server_connected = true;
                    if (!state.lan_connected)
                        state.lan_connected = true;
                    break;
                case 5:
                    if (state.server_connected)
                        state.server_connected = false; 
                    break;   
            }
        }
        if (s.hasOwnProperty('action')) {
            state.action.action = s.action;
            state.action.desc = s.desc;
            state.connected = false;
            state.lan_connected = false;
            if (s.hasOwnProperty('timer')) {
                state.action.timer = s.timer;
            } else {
                state.action.timer = null;
            }
            //state.action = Object.assign({}, state.action);
        }        
        //state.description = s.desc;
        //console.log(state);
        console.log(state.action);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};