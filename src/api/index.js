import Vue from 'vue'
import VueResource from 'vue-resource'	// 发送http请求
// import cookies from 'js-cookie'
// import store from '../vuex/store'

Vue.use(VueResource)

const API_ROOT = process.env.api	// 服务器地址

// const sysResource = Vue.resource(API_ROOT + 'public{/controller}')
// const privateResource = Vue.resource(API_ROOT + 'private{/controller}')
// // const adminResource = Vue.resource(API_ROOT + 'admin{/id}')

// 定义拦截器
Vue.http.interceptors.push((request, next) => {
	// 请求前所做的逻辑
	// Vue.http.headers.common['admin'] = window.sessionStorage.token
	// store.commit("SET_SHOW_LOADING", true)
	// 请求发送后的逻辑
	next((response) => {
		// store.commit("SET_SHOW_LOADING", false)
		// 如果返回401代码，则退出登陆页
		if (response.status === 401) {
			// window.location.hash = '#!/login'
			console.log("无权限操作")
		} else if (response.status === 200) {
			// 获取数据失败逻辑
			if (!response.body.success) {
				console.log("获取数据失败")
			}
		}
	})
})

export default {
// 	// 获取导航列表
// 	getNavList() {
// 		return publicResource.get({controller: "getNavList"})
// 	},
// 	// 获取文章列表
// 	getInforList(opts) {
// 		store.commit("SET_IS_LOADING", true)
// 		return publicResource.get({controller: "getInforList", opts})
// 	},
// 	// 获取私有文章
// 	getPrivateInfor(opts) {
// 		return this.post("private/getPrivateInfor",opts)
// 	},

	// 通用get方法
	get(url, param = {}) {
		return Vue.resource(API_ROOT + url).get(param)
		// return {
		// 	success: true,
		// 	data: [{url:"url", name:"name"}]
		// }
	},

	// 通用post方法
	post(url, param = {}) {
		return Vue.http.post(API_ROOT + url, param, { emulateJSON : true})
	}

}
