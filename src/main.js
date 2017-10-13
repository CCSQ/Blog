// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import utils from './utils/utils'
import router from './router'


import 'iview/dist/styles/iview.css'
import './assets/css/default.less'

import VueI18n from 'vue-i18n'
import iView from 'iview'
import localLange from './lange'	// 本地国际化
import enLocale from 'iview/dist/locale/en-US'
import zhLocale from 'iview/dist/locale/zh-CN'

Vue.use(VueI18n)
Vue.use(iView)
Vue.use(utils)

Vue.config.lang = 'zh-CN'

// 将本地语言包和iwiew结合
const mergeZH = Object.assign(zhLocale, localLange['zh-CN']);
const mergeEN = Object.assign(enLocale, localLange['en-US'])

Vue.locale('zh-CN', mergeZH)
Vue.locale('en-US', mergeEN)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
