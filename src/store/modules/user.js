const userInfo = uni.getStorageSync('userInfo') || { token: 'eyJzdGFmZl9pZCI6MTY1LCJoZWFkX3Bob3RvIjoiIiwic3RhZmZfbmFtZSI6Ilx1NzllNlx1OWU0Zlx1N2EwYiIsImlzX3N1cGVyIjoxLCJkZXBhcnRtZW50X2lkIjoyMCwiaXNfZGlyZWN0b3IiOjAsInRpbWVfb3V0IjoxNjQxMDE2OTc3fQ==' }
const questionBankInfo = uni.getStorageSync('questionBankInfo') || {}
const user = {
    state: {
        userInfo: userInfo,
        questionBankInfo: questionBankInfo
    },
    mutations: {
        SET_USER_INFO(state, data) {
            state.userInfo = data
        },
        SET_QUESTION_BANK_INFO(state, data) {
            state.questionBankInfo = data
        }
    },
    actions: {
        setQuestionBankInfo({ commit }, data) {
            commit('SET_QUESTION_BANK_INFO', data)
            uni.setStorage({
                key: 'questionBankInfo',
                data
            });
        },
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