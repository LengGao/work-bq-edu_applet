import Vue from 'vue'
const filters = {
    phoneFormat(val) {
        if (!val) return '--'
        return (val + '').replace(/(\d{3})\d{4}(\d{4})/, `$1****$2`)
    },
    idCardFormat(val) {
        if (!val) return '--'
        return (val + '').replace(/(\d{2})\d+(\d{3})/, `$1**************$2`)
    },
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
    },
    orderApplyStatus(status, isText) {
        const applyStatusMap = {
            1: {
                text: "待审核",
                color: "#fdc400",
            },
            2: {
                text: "审核中",
                color: "#199fff",
            },
            3: {
                text: "已通过",
                color: "#59D234",
            },
            8: {
                text: "已撤销",
                color: "#c0c4cc",
            },
            9: {
                text: "已驳回",
                color: "#fd6500",
            },
        }
        if (isText) {
            return applyStatusMap[status].text || '--'
        }
        return applyStatusMap[status].color || ''
    },
}

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})