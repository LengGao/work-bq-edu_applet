export default {
    methods: {
        getContext() {
            const pages = getCurrentPages();
            return pages[pages.length - 1];
        },
    },
    onShareAppMessage() {
        const crurentPage = this.getContext()
        const params = encodeURIComponent(`is_share=1&q=${this.$store.getters.question_bank_id}`)
        console.log(params)
        return {
            path: `${crurentPage.route}?scene=${params}`
        }
    },
}