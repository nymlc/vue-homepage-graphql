import Vue from 'vue';
import App from './App';
import router from '@/router';
import store from '@/store';// 引入Vuex
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as filters from '@/filters';// 引入全局过滤器

import '@/icons'; // icon
import '@/mock/index';// 引入mockjs
import i18n from './i18n';// 引入i18n
import './permission'; // 权限
import { apolloProvider } from './vue-apollo'; // 权限
import VueTouch from 'vue-touch';
Vue.use(VueTouch, { name: 'v-touch' });

Vue.use(Element, {
    i18n: (key, value) => i18n.t(key, value)
});

// 注册全局过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    apolloProvider,
    template: '<App/>',
    components: {
        App
    }
});
