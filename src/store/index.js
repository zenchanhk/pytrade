import Vue from 'vue';
import Vuex from 'vuex';
import symbols from './modules/symbols';
import status from './modules/status';
import settings from './modules/settings';
import orders from './modules/orders';

Vue.use(Vuex);

//const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        symbols,
        status,
        settings,
        orders
    },
    //strict: debug,
    //plugins: debug ? [createLogger()] : []
});