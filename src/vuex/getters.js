// 从变量池中获取数据

// 系统模块
export function getNavList(state) {
	return state.sys.navList
}

export function getScreenWidth(state) {
	return state.sys.screenWidth
}

export function getIsXs(state) {	// 是否小屏，暂未使用
	return state.sys.screenWidth < process.env.xs
}

export function getMusicList(state) {
	return state.sys.musicList
}



// 用户模块
export function getIsLogin(state) {
	return state.user.isLogin
}