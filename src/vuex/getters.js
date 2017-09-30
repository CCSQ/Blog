// 从变量池中获取数据

// 系统模块
export function getNavList(state) {
	return state.sys.navList
}

export function getChildNavList(state) {
	return state.sys.childNavList
}

export function getScreenWidth(state) {
	return state.sys.screenWidth
}

export function getIsXs(state) {
	return state.sys.screenWidth < process.env.xs
}

export function getLeftNavShow(state) {
	return state.sys.leftNavShow
}

export function getMusicList(state) {
	return state.sys.musicList
}

export function getIsLogin(state) {
	return state.user.isLogin
}