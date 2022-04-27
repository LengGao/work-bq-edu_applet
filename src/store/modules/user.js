import { getUserId } from "@/api/dataBoard";
const userInfo = uni.getStorageSync('userInfo') || { token: 'eyJzdGFmZl9pZCI6MjkxLCJoZWFkX3Bob3RvIjoiIiwic3RhZmZfbmFtZSI6Ilx1Njg4MVx1NTE0OSIsImlzX3N1cGVyIjoxLCJkZXBhcnRtZW50X2lkIjoyMCwiaXNfZGlyZWN0b3IiOjEsInRpbWVfb3V0IjoxNjQ4OTkxMjI4fQ==' }

const user = {
    state: {
        userInfo: userInfo,
        checkedStaffIds: [],
        checkedStaffData: []
    },
    mutations: {
        SET_USER_INFO(state, data) {
            state.userInfo = data
        },
        SET_CHECKED_STAFF_ID(state, data) {
            state.checkedStaffIds = data
        },
        SET_CHECKED_STAFF_DATA(state, data) {
            state.checkedStaffData = data
        },
    },
    actions: {
        setUserInfo({ commit }, data) {
            commit('SET_USER_INFO', data)
            uni.setStorage({
                key: 'userInfo',
                data
            });
        },
        async getUserId({ commit }, { arr_uid, arr_group, checkedData }) {
            const data = { arr_uid, arr_group};
            const res = await getUserId(data);
            commit('SET_CHECKED_STAFF_ID', res.data)
            commit('SET_CHECKED_STAFF_DATA', checkedData)
        },
    }
}
export default user