import Vue from 'vue'
const filters = {
    moneyFormat(number) {
        number = (number * 1 || 0).toFixed(3).slice(0, -1)
        return `￥${number}`
    },
    orderStatus(status) {
        const statusMap = {
            0: "未付款",
            1: "新订单",
            2: "部分付款",
            3: "已付款",
            4: "已作废",
            5: "已退款",
        }
        return statusMap[status]
    },
    orderTagColor(status) {
        const tagTypeMap = {
            0: "#888",
            1: "#888",
            2: "#ff976a",
            3: "#07c160",
            4: "#ee0a24",
            5: "#ee0a24",
        }
        return tagTypeMap[status]
    }

}

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})