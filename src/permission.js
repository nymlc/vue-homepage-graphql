import router from '@/router';
// 引入Vuex
import store from '@/store';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式
import { getAccessToken } from '@/utils/auth';
import { apolloClient } from './vue-apollo'; // 权限
import { Base64 } from 'js-base64';
import gql from 'graphql-tag';
const getUserInfo = async token => {
    const id = await Base64.decode(token).match(
        /"userId":"(\w+)/
    )[1];
    return await apolloClient.query({
        query: gql`query q_userById($id: MongoID!) {
            userById(_id: $id){
              _id
              role
              username
              password,
              avatar
            }
          }`,
        variables: {
            id
        }
    });
};

// 未登录下不重定向的白名单
const whiteList = ['/login', '/articles'];
router.beforeEach(async(to, from, next) => {
    NProgress.start();
    if (whiteList.some(value => to.path.startsWith(value))) {
        next();
    } else {
        if (getAccessToken()) {
            // 若是进入login界面，则直接跳转主页
            if (to.path === '/login') {
                next({
                    path: '/dashboard'
                });
            } else {
                // 未拉取用户信息
                if (!store.getters.roles.length) {
                    const userInfo = await getUserInfo(store.getters.access_token);
                    store.dispatch('GetInfo', userInfo.data.userById);
                    const { role } = userInfo.data.userById;
                    store.dispatch('GenerateRoutes', { role }).then(() => { // 生成可访问的路由表
                        router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
                        next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
                    });
                } else {
                    next();
                }
            }
        } else {
            next({
                path: '/login'
            });
        }
    }
});
router.afterEach(() => {
    NProgress.done();
});
