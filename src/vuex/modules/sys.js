// 系统变量


// 定义变量池和方法
import * as types from '../mutation-types'

// 变量池
const state = {
	navList: [],	// 导航列表
	childNavList: [],
	screenWidth: 768,
	musicList: [{id:1,url:'http://localhost:8088/static/media/demo.65b341f.mp3',name:'demo'}]

}

// 定义方法
const mutations = {

	// [types.SET_SHOW_LOADING](state, showLoading) {
	// 	state.showLoading = showLoading
	// },

	// [types.SET_IS_CAN_EDIT](state, isCanEdit) {
	// 	state.isCanEdit = isCanEdit
	// },

	[types.SET_SCREEN_WIDTH](state, clientWidth) {
		state.screenWidth = clientWidth
	},

	[types.SET_CHILD_NAV_LIST](state, index) {
		if (state.navList.length > index) {
			state.childNavList = state.navList[index].child
			// console.log('子菜单被修改',state.childNavList)
		}
	},

	[types.SET_NAV_LIST](state, navList) {
		state.navList = navList
		state.childNavList = state.navList[0].child
	},



}

export default {
	state,
	mutations
}
