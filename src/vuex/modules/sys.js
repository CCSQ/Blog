// 系统变量


// 定义变量池和方法
import * as types from '../mutation-types'

// 变量池
const state = {
	navList: [],	// 导航列表
	screenWidth: 768,	// 宽度
	musicList: [
		{id:1,url:'http://localhost:8088/static/media/demo.65b341f.mp3',name:'demo'},
		{id:1,url:'http://localhost:8088/static/media/demo.65b341f.mp3',name:'demo'},
	],

}

// 定义方法
const mutations = {

	[types.SET_SCREEN_WIDTH](state, clientWidth) {
		state.screenWidth = clientWidth
	},

	[types.SET_NAV_LIST](state, navList) {
		state.navList = navList
	},

	[types.SET_MUSIC_LIST](state, musicList) {
		state.musicList = musicList
	},

}

export default {
	state,
	mutations
}
