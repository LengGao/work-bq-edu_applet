import Vue from 'vue'
import App from './App'
import '@/utils/filters'
import '@/mixins'
//引入vuex
import store from './store'
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  //挂载
  store
})
app.$mount()
