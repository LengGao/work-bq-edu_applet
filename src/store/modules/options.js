
import { getStaffList, getProjectOptions, getCateList } from '@/api/order'
const options = {
    state: {
        projectOptions: [],
        categoryOptions: [],
        staffOptions: []
    },
    mutations: {
        SET_PROJECT_OPTIONS(state, data) {
            state.projectOptions = data
        },
        SET_CATEGORY_OPTIONS(state, data) {
            state.categoryOptions = data
        },
        SET_STAFF_OPTIONS(state, data) {
            state.staffOptions = data
        },
    },
    actions: {
        // 获取项目选项
        async getProjectOptions({ commit }) {
            const res = await getProjectOptions()
            commit('SET_PROJECT_OPTIONS', res.data)
        },
        // 获取分类选项
        async getCategoryOptions({ commit }) {
            const res = await getCateList()
            commit('SET_CATEGORY_OPTIONS', res.data)
        },
        // 获取老师选项
        async getStaffOptions({ commit }) {
            const data = {
                limit: 9999,
            };
            const res = await getStaffList(data);
            commit('SET_STAFF_OPTIONS', res.data.list)
        },
    }
}
export default options