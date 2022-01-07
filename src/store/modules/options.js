
import { getStaffList, getProjectOptions, getCateList } from '@/api/order'
const options = {
    state: {
        projectOptions: [],
        categoryOptions: [],
        staffOptions: [],
        payStatusOptions: [
            {
                value: 0,
                name: "未付款",
            },
            {
                value: 1,
                name: "新订单",
            },
            {
                value: 2,
                name: "部分付款",
            },
            {
                value: 3,
                name: "已付款",
            },
            {
                value: 4,
                name: "已作废",
            },
            {
                value: 5,
                name: "已退款",
            },
        ],
        approveOptions: [
            {
                value: 1,
                name: "待审核",
            },
            {
                value: 2,
                name: "（多人）审核中",
            },
            {
                value: 3,
                name: "审核通过",
            },
            {
                value: 8,
                name: "已撤销审核",
            },
            {
                value: 9,
                name: "驳回不通过",
            },
        ],
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