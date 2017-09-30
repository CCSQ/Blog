// // 分发操作
import * as types from './mutation-types'
import sysServer from '../services/sys'

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

export const setLeftNavShow = ({commit}, leftNavShow) => {
	commit(types.SET_LEFT_NAV_SHOW, leftNavShow)
}

export const setIsLogin = ({commit}) => {
	// 从服务端获取
	commit(types.SET_IS_LOGIN, false)
}
