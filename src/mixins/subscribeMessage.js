// 订阅模板消息设置
let isShow = true
export default {
    onLoad() {
        wx.getSetting({
            withSubscriptions: true,
            success: (res) => {
                const { itemSettings } = res.subscriptionsSetting
                this.getSubscribeStatus(itemSettings)
            }
        })
    },
    // tab切换的时候触发订阅弹窗
    onTabItemTap() {
        this.requestSubscribeMessage()
    },
    methods: {
        getSubscribeStatus(itemSettings) {
            // ss('itemSettings', itemSettings)
            if (!itemSettings) {
                return
            }
            const resoult = []
            for (const k in itemSettings) {
                resoult.push(itemSettings[k])
            }
            if (resoult.length && !resoult.includes('reject')) {
                isShow = false
            }
        },
        requestSubscribeMessage() {
            if (!isShow) {
                return
            }
            wx.requestSubscribeMessage({
                tmplIds: [
                    "3j_MA7TPV5KuqyIo7G_8epqrkxR2L7UQx7fOE1eKAMg",
                    "UgIIS104Nc5Ln3nDjpHfEvWXDI2UwdaJkiVf9NTF7Lw",
                    "S1K7I-Z_TFs8ZlXGD-DOU6e4gwEcZBhv43Vlj4aXr7M",
                ],
                success: ({ errMsg, ...rest }) => {
                    this.getSubscribeStatus(rest)
                },
                fail(err) {
                    // console.log(err);
                },
            });
        }
    },
}