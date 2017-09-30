// 用户变量


// 定义变量池和方法
import * as types from '../mutation-types'

// 变量池
const state = {
	isLogin: null,	// 是否登陆状态

}

// 定义方法
const mutations = {

	[types.SET_IS_LOGIN](state, isLogin) {
		state.isLogin = isLogin
	},

}

export default {
	state,
	mutations
}
