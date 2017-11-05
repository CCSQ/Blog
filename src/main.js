// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import utils from './utils/utils'	// 工具

import local from '@/local/index'

import router from './router'	// 路由

import directive from './directive'	// 自定义指令

// css文件
import 'iview/dist/styles/iview.css'
import 'highlight.js/styles/monokai-sublime.css'
import '@/assets/css/default.less'

import VueI18n from 'vue-i18n'
import iView from 'iview'
import localLange from './lange'	// 本地国际化
import enLocale from 'iview/dist/locale/en-US'
import zhLocale from 'iview/dist/locale/zh-CN'

import LazyRender from 'vue-lazy-render'	// 延迟渲染

import VueQuillEditor from 'vue-quill-editor'	// 富文本

// 加载quill插件
import { CodeSelector } from '@/assets/js/quill/CodeSelector.js'
import { ImageImport } from '@/assets/js/quill/ImageImport.js'
import { ImageResize } from '@/assets/js/quill/ImageResize.js'

VueQuillEditor.Quill.register('modules/codeSelector', CodeSelector)
VueQuillEditor.Quill.register('modules/imageImport', ImageImport)
VueQuillEditor.Quill.register('modules/imageResize', ImageResize)

Vue.use(VueI18n)
Vue.use(iView)
Vue.use(utils)
Vue.use(VueQuillEditor)

Vue.use(LazyRender)

// 将本地语言包和iwiew结合
const mergeZH = Object.assign(zhLocale, localLange['zh-CN'])
const mergeEN = Object.assign(enLocale, localLange['en-US'])

Vue.locale('zh-CN', mergeZH)
Vue.locale('en-US', mergeEN)

Vue.config.lang = local.isExitLocalStorage('personalizedSettings') ? local.getByLocalStorage('personalizedSettings').personalizedSettings.lang : 'zh-CN'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
})
