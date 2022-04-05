import { getUserId } from "@/api/dataBoard";
const userInfo = uni.getStorageSync('userInfo') || { token: 'eyJzdGFmZl9pZCI6MTY1LCJoZWFkX3Bob3RvIjoiIiwic3RhZmZfbmFtZSI6Ilx1NzllNlx1OWU0Zlx1N2EwYiIsImlzX3N1cGVyIjoxLCJkZXBhcnRtZW50X2lkIjoMCwiaXNfZGlyZWN0b3IiOjAsInRpbWVfb3V0IjoxNjQ3MzI4NDA0fQ' }
// const userInfo = {"staff_id":291,"head_photo":"","staff_name":"梁光","is_super":1,"department_id":20,"is_director":1,"time_out":1648991228,"token":"eyJzdGFmZl9pZCI6MjkxLCJoZWFkX3Bob3RvIjoiIiwic3RhZmZfbmFtZSI6Ilx1Njg4MVx1NTE0OSIsImlzX3N1cGVyIjoxLCJkZXBhcnRtZW50X2lkIjoyMCwiaXNfZGlyZWN0b3IiOjEsInRpbWVfb3V0IjoxNjQ4OTkxMjI4fQ=="}

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
            const data = {
                arr_uid,
                arr_group,
            };
            const res = await getUserId(data);
            commit('SET_CHECKED_STAFF_ID', res.data)
            commit('SET_CHECKED_STAFF_DATA', checkedData)
        },
    }
}
export default user