import { getAccessToken, getRefreshToken, removeToken, setRefreshToken, setAccessToken } from '@/utils/auth';
const refresh_token = getRefreshToken();
const access_token = getAccessToken();
const user = {
    state: {
        refresh_token,
        access_token,
        name: '',
        avatar: '',
        roles: []
    },

    mutations: {
        SET_ACCESSTOKEN: (state, token) => {
            state.access_token = token;
        },
        SET_REFRESHTOKEN: (state, token) => {
            state.refresh_token = token;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        }
    },

    actions: {
        // 登录
        Login({ commit }, data) {
            const { access_token, refresh_token } = data;
            setAccessToken(access_token);
            setRefreshToken(refresh_token);
            commit('SET_ACCESSTOKEN', access_token);
            commit('SET_REFRESHTOKEN', refresh_token);
        },

        // 获取用户信息
        GetInfo({ commit }, data) {
            const { role, name, avatar } = data;
            commit('SET_ROLES', role);
            commit('SET_NAME', name);
            commit('SET_AVATAR', avatar);
        },

        // 登出
        LogOut({ commit }) {
            commit('SET_ACCESSTOKEN', '');
            commit('SET_REFRESHTOKEN', '');
            commit('SET_ROLES', []);
            removeToken();
        },

        // 前端 登出
        FedLogOut({ commit }) {
            commit('SET_ACCESSTOKEN', '');
            commit('SET_REFRESHTOKEN', '');
            removeToken();
        }
    }
};

export default user;
