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

export function getMusicList(state) {
	return state.sys.musicList
}

// export function getShowLoading(state) {
// 	return state.public.showLoading
// }

// export function isCanEdit(state) {
// 	return state.public.isCanEdit
// }

// export function getInitParam(state) {
// 	return state.public.initParam
// }

// // export function getIsLoading(state) {
// // 	return state.mainList.isLoading
// // }

// // export function getInforList(state) {
// // 	return state.mainList.inforList
// // }

// // export function getType(state) {
// // 	return state.public.typeName
// // }