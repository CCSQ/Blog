import Vue from 'vue'
import VueResource from 'vue-resource'	// 发送http请求
import local from '@/local/index'
var xhr = new XMLHttpRequest()	// XMLHttpRequest 对象请求
// import cookies from 'js-cookie'
// import store from '../vuex/store'

Vue.use(VueResource)

const API_ROOT = process.env.api	// 服务器地址

// const sysResource = Vue.resource(API_ROOT + 'public{/controller}')


// 定义拦截器
Vue.http.interceptors.push((request, next) => {
	// 请求前所做的逻辑
	Vue.http.headers.common['token'] = local.getByLocalStorage('token') || ''
	window.$Loading.start()
	
	// 请求发送后的逻辑
	next((response) => {
		if (response.body.pb) {
			response.body.pb.pageIndex = Number.parseInt(response.body.pb.pageIndex)
			response.body.pb.pageSize = Number.parseInt(response.body.pb.pageSize)
		}
		// 如果返回401代码，则退出登陆页
		if (response.status === 401) {
			// window.location.hash = '#!/login'
			console.log("无权限操作")
		} else if (response.status === 200) {
			// 获取数据失败逻辑
			window.$Loading.finish()
			if (!response.body.success) {
				// console.log("获取数据失败")
			}
		}
	})
})

export default {

	// 通过XMLHttpRequest对象获取url信息, 解构赋值，param默认为空
	getByXMLHttpRequest(
		url, 
		{
			param = {},
			responseType = '',	// 响应类型
		},
		onload = (xhr = null) => {}
	) {
		xhr.open('GET', url, true)
		xhr.responseType = responseType
		xhr.onload = () => {
			onload(xhr)
		}
		xhr.send();
	},

	
	getOtherUrl(url, { param = {}, options = {} }) {
		return Vue.resource(url).get(param, options)
	},



	

	















	// #####################################################################
	// 获取静态数据
	getStaticSources: (url) => {
		let param = {}
		return Vue.resource(API_ROOT + url).get(param)
	},

	// 通用post方法
	post: (url, param = {}) => {
		return Vue.http.post(API_ROOT + url, param, { emulateJSON : true})
	},

	// 通用get方法
	get: (url, param = {}) => {
		return Vue.resource(API_ROOT + url).get(param)
	},

	// 通用delete方法
	delete: (url, param = {}) => {
		return Vue.resource(API_ROOT + url).delete(param)
	},

	// 通用put方法
	put: (url, param = {}) => {
		return Vue.http.put(API_ROOT + url, param, { emulateJSON : true})
	},

	// 图片上传方法
	imgPost: (url, param = {}, onProgress = (event) => {}) => {
		return Vue.http.post(
			API_ROOT + url,
			param,
			{ emulateJSON : true, progress: (event) => { onProgress(event) } }
		)
	},


}
