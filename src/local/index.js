// 本地缓存操作

function isLocalStorageSupport() {
	return window.localStorage
}

export default{
	saveToLocalStorage(name,object) {
		if (isLocalStorageSupport()) {
			window.localStorage.setItem(name, JSON.stringify(object))
		}
	},

	getByLocalStorage(name) {
		if (isLocalStorageSupport()) {
			let item = window.localStorage.getItem(name)
			if (item) item = JSON.parse(item)
			return item
		}
	},

	deleteByLocalStorage(name) {
		if (isLocalStorageSupport()) {
			window.localStorage.removeItem(name)
		}
	},
}