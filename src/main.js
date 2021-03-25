import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
import './mock' // simulation data

import * as filters from './filters' // global filters

import request from '@/utils/request'
// import Bus from '@/utils/bus'
import { hasPermission } from './utils/hasPermission'
//城市选择联动插件
import 'vue-area-linkage/dist/index.css'; // v2 or higher
import VueAreaLinkage from 'vue-area-linkage';
Vue.use(VueAreaLinkage);
// 全局的常量
Vue.prototype.g_request = request
Vue.prototype.g_hasPerm = hasPermission

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})


// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
       
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  data: {
    // 空的实例放到根组件下，所有的子组件都能调用
    bus: new Vue()
  },
  template: '<App/>',
  components: { App },
  mounted: function () {
    // window.bus = this.bus;
    this.bus.$emit('id-selected', '1')
    // this.bus.$on('id-selected', value =>  {
    //   console.log(value);
    // })
  }
})

