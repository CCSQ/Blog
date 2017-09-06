// // 分发操作
import * as types from './mutation-types'
import sysServer from '../services/sys'
// import setServer from '../services/set'
// import login from '../services/login'

export const setNavList = ({ commit }) => {
	// 做客户端缓存
	sysServer.getNavList().then(function (res) {
		commit(types.SET_NAV_LIST, res.body.data)
	})
}

export const setChildNavList = ({commit}, index) => {
	commit(types.SET_CHILD_NAV_LIST, index)
}

export const setScreenWidth = ({commit}, clientWidth) => {
	commit(types.SET_SCREEN_WIDTH, clientWidth)
}

// // 设置博客的导航栏
// export const setNavListToServer = ({ commit,state }, navList) => {
// 	setServer.setNavList(navList).then(function (res) {
// 		if (res.body) {
// 			commit(types.SET_NAV_LIST, navList)
// 		}
// 	})
// }

// export const setShowLoading = ({ commit,state }, showLoading) => {
// 	commit(types.SET_SHOW_LOADING, showLoading)
// }

// export const setInitParam = ({ commit,state }) => {
// 	publicServer.getInitParam().then(function (res) {
// 		commit(types.SET_INIT_PARAM, res.body)
// 	})
// }

// export const setInitParamByName = ({ commit,state }, param) => {
// 	// console.log(param)
// 	commit(types.SET_INIT_PARAM_BY_NAME, param)
// }

// export const setIsCanEdit = ({ commit,state }) => {
// 	// 服务端判断验证
// 	login.getIsLogin().then((res) => {
// 		commit(types.SET_IS_CAN_EDIT, res.body)
// 	})
// }

// // export const setInforList = ({ commit, state }, opts) => {
// // 	api.getInforList(opts).then(function (res) {
// // 		commit(types.SET_INFOR_LIST, res.body)
// // 	})
// // }

// // export const emptyInforList = ({ commit, state }) => {
// // 	commit(types.EMPTY_INFOR_LIST)
// // }

// // export const setIsLoading = ({ commit,state, }, isLoading) => {
// // 	commit(types.SET_IS_LOADING, isLoading)
// // }

// // export const setPrivatePwd = ({ commit,state }, opts) => {
// // 	api.getPrivateInfor({id: opts.id, pwd: opts.pwd}).then(function (res) {
// // 		if (res.body) {
// // 			commit(types.SET_PRIVATE_INFOR, {index: opts.index, id: opts.id, infor: res.body})
// // 		} else {
// // 			alert("密码不正确")
// // 		}
// // 		// if (res.body) {}
// // 		// console.log(opts)
// // 	})
// // }