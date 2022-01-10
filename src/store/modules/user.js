const userInfo = uni.getStorageSync('userInfo') || { token: 'eyJzdGFmZl9pZCI6MTY1LCJoZWFkX3Bob3RvIjoiIiwic3RhZmZfbmFtZSI6Ilx1NzllNlx1OWU0Zlx1N2EwYiIsImlzX3N1cGVyIjowLCJkZXBhcnRtZW50X2lkIjoyMCwiaXNfZGlyZWN0b3IiOjAsInRpbWVfb3V0IjoxNjQxNzI1ODM3fQ' }
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