
import { getStaffList, getProjectOptions, getCateList } from '@/api/order'
import { getCustomfieldOptions, getCrmTags } from "@/api/customer";
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
        eduOptions: [
            {
                name: "初中及以下",
            },
            {
                name: "中专/中技",
            },
            {
                name: "高中",
            },
            {
                name: "高中",
            },
            {
                name: "大专",
            },
            {
                name: "本科",
            },
            {
                name: "研究生及以上",
            },
        ],
        fromOptions: [],
        tagOptions: [],
        payTypeOptions: [],
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
        SET_FROM_OPTIONS(state, data) {
            state.fromOptions = data
        },
        SET_TAG_OPTIONS(state, data) {
            state.tagOptions = data
        },
        SET_PAY_TYPE_OPTIONS(state, data) {
            state.payTypeOptions = data
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
        // 获取客户来源
        async getFromOptions({ commit }) {
            const data = {
                field_name: "customer_source",
            };
            const res = await getCustomfieldOptions(data);
            commit('SET_FROM_OPTIONS', res.data.field_content.map((item) => ({
                name: item,
            })))
        },
        // 获取客户标签
        async getCrmTags({ commit }) {
            const data = {
                type: 1,
            };
            const res = await getCrmTags(data);
            commit('SET_TAG_OPTIONS', res.data.tags.map((item) => ({
                name: item,
            })))
        },
        // 获取支付方式
        async getPayTypeOptions({ commit }) {
            const data = {
                field_name: "payment_method",
            };
            const res = await getCustomfieldOptions(data);
            commit('SET_PAY_TYPE_OPTIONS', res.data.field_content.map((item) => ({
                name: item,
            })))
        },
    }
}
export default options