const userInfo = uni.getStorageSync('userInfo')
const user = {
    state: {
        userInfo: userInfo,
    },
    mutations: {
        SET_USER_INFO(state, data) {
            state.userInfo = data
        },
    },
    actions: {
        setUserInfo({ commit }, data) {
            commit('SET_USER_INFO', data)
            uni.setStorage({
                key: 'userInfo',
                data
            });
        }
    }
}
export default user