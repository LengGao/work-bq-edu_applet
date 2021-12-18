export default {
    methods: {
        goBack() {
            console.log('minxin--back')
            const indexPage = getCurrentPages()[0] || {}
            if (indexPage.route !== 'pages/index/index') {
                uni.switchTab({
                    url: '/pages/index/index'
                });
            } else {
                uni.navigateBack({
                    delta: 1
                })
            }

        }
    },
}