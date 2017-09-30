// 系统变量


// 定义变量池和方法
import * as types from '../mutation-types'

// 变量池
const state = {
	navList: [	// 导航列表
			{ id: 1, icon: "wrench", name: "头目录1", url: "头目录1", child: [
					{id: 2, icon: "wrench", name: "子目录1-1", url: "子目录1-1",child: []},
					{id: 3, icon: "wrench", name: "子目录1-2", url: "子目录1-2",child: [
							{id: 4, icon: "wrench", name: "子目录1-2-1", url: "子目录1-2-1",},
							{id: 5, icon: "wrench", name: "子目录1-2-2", url: "子目录1-2-2",},
							{id: 6, icon: "wrench", name: "子目录1-2-3", url: "子目录1-2-3",},
						]
					},
					{id: 7, icon: "wrench", name: "子目录1-3", url: "子目录1-3",child: []},
				],
			},
			{ id: 8, icon: "wrench", name: "头目录2", url: "头目录2", child: [
					{id: 9, icon: "wrench", name: "子目录2-1", url: "子目录2",child: []},
					{id: 10, icon: "wrench", name: "子目录2-2", url: "子目录2",child: []},
					{id: 11, icon: "wrench", name: "子目录2-3", url: "子目录2",child: []},
					{id: 12, icon: "wrench", name: "子目录2-4", url: "子目录2",child: [
							{id: 13, icon: "wrench", name: "子目录2-4-1", url: "子目录2-4-1",},
							{id: 14, icon: "wrench", name: "子目录2-4-2", url: "子目录2-4-2",},
							{id: 15, icon: "wrench", name: "子目录2-4-3", url: "子目录2-4-3",},
						]
					},
				],
			},
		],
	childNavList: [],
	screenWidth: 768,	// 宽度
	musicList: [
		{id:1,url:'http://localhost:8088/static/media/demo.65b341f.mp3',name:'demo'},
		{id:1,url:'http://localhost:8088/static/media/demo.65b341f.mp3',name:'demo'},
	],
	leftNavShow: false,	// 侧边栏是否显示

}

// 定义方法
const mutations = {

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

	[types.SET_LEFT_NAV_SHOW](state, leftNavShow) {
		state.leftNavShow = leftNavShow
	},

}

export default {
	state,
	mutations
}
