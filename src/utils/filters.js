import Vue from 'vue'
const min = (val) => val < 10 ? '0' + val : val
const filters = {
    moneyFormat(number) {
        return `￥${number || '0.00'}`

    },
    filterPhone(val) {
        if (!val) return "--";
        val = val + ''
        let start = val.substr(0, 3);
        let end = val.substr(-4);
        return `${start}****${end}`;
    },
    filterIdCard(val) {
        if (!val) return "--";
        val = val + ''
        let start = val.substr(0, 3);
        let end = val.substr(-4);
        return `${start}***********${end}`;
    },
    removeTag(val) {
        const regx = /<[^>]*>|<\/[^>]*>/gm;
        return val ? val.replace(regx, "") : ''
    },
    // 视频时长
    filterDuration(val) {
        val = (+val || 0).toFixed(0)
        let s = val
        let h = 0
        let m = 0
        if (s >= 60) {
            m = Math.floor(s / 60)
            s = s % 60
        }
        if (m >= 60) {
            h = Math.floor(m / 60)
            m = m % 60
        }
        return `${min(h)}:${min(m)}:${min(s)}`
    },
    // 视频大小
    filterFileSize(b) {
        let kb = 0
        let mb = 0
        let g = 0
        if (b / 1024 >= 1) {
            kb = (b / 1024).toFixed(2)
            if (kb < 1024) {
                return `${kb}KB`
            }
        }
        if (kb / 1024 >= 1) {
            mb = (kb / 1024).toFixed(2)
            if (mb < 1024) {
                return `${mb}MB`
            }
        }
        if (mb / 1024 >= 1) {
            g = (mb / 1024).toFixed(2)
            return `${g}G`
        }
        return `${b}B`
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
    }

}

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})