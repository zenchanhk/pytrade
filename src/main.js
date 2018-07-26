// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import antd from 'vue-antd-ui';
import 'vue-antd-ui/dist/antd.css';
import store from './store/index';
import Icon from 'vue-svg-icon/Icon.vue';
import VueResizeSensor from 'vue-resizesensor';
import VueDraggableResizable from 'vue-draggable-resizable';
import VueObserveVisibility from 'vue-observe-visibility'

Vue.config.productionTip = false;

Vue.use(antd);
Vue.use(VueObserveVisibility);
Vue.component('icon', Icon); 
Vue.component('resize-sensor', VueResizeSensor);
Vue.component('vue-draggable-resizable', VueDraggableResizable);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    store,
});
