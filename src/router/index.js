import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Home from '@/components/index.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/h',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/',
            name: 'Home',
            component: Home
        }
    ]
});
