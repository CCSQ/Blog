// 分发操作
import * as types from './mutation-types'
import sysServer from '../services/sys'
import local from '@/local'

// 系统模块
export const setNavList = ({ commit }, navList) => {
	// 登陆时获取
	if (navList) local.saveToSessionStorage('navList', navList)

	// 做客户端缓存
	if (!local.isExitSessionStorage('navList')) {
		sysServer.getNavList().then(function (res) {
			if (res.body.success) {
				local.saveToSessionStorage('navList', res.body.data)
				commit(types.SET_NAV_LIST, res.body.data)
			}
		})
	} else {
		commit(types.SET_NAV_LIST, local.getBySessionStorage('navList'))
	}
}

export const setScreenWidth = ({commit}, clientWidth) => {
	commit(types.SET_SCREEN_WIDTH, clientWidth)
}

export const setMusicList = ({commit}) => {
	if (!local.isExitSessionStorage('musicList')) {
		sysServer.getMusicList().then(function (res) {
			if (res.body.success) {
				local.saveToSessionStorage('musicList', res.body.data)
				commit(types.SET_MUSIC_LIST, res.body.data)
			}
		})
	} else {
		commit(types.SET_MUSIC_LIST, local.getBySessionStorage('musicList'))
	}
}



// 从用户模块取
export const setIsLogin = ({commit}, flag) => {
	if (flag) local.saveToSessionStorage('isLogin', flag)

	if (local.isExitSessionStorage('isLogin')) flag = local.getBySessionStorage('isLogin')
	
	// 从服务端获取
	commit(types.SET_IS_LOGIN, flag)
}
