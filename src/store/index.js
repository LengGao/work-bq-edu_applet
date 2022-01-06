import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import user from './modules/user'
import options from './modules/options'
import getters from './getters'
const store = new Vuex.Store({
    modules: {
        user,
        options
    },
    getters
})
export default store