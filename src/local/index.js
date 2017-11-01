// 本地缓存操作

function isLocalStorageSupport() {
	return window.localStorage
}

function isSessionStorageSupport() {
	return window.sessionStorage
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

	isExitLocalStorage: (name) => {
		if (isLocalStorageSupport()) {
			return window.localStorage.getItem(name)
		}
	},

	// sessionStorage
	saveToSessionStorage(name,object) {
		if (isSessionStorageSupport()) {
			window.sessionStorage.setItem(name, JSON.stringify(object))
		}
	},

	getBySessionStorage(name) {
		if (isSessionStorageSupport()) {
			let item = window.sessionStorage.getItem(name)
			if (item) item = JSON.parse(item)
			return item
		}
	},

	deleteBySessionStorage(name) {
		if (isSessionStorageSupport()) {
			window.sessionStorage.removeItem(name)
		}
	},

	isExitSessionStorage: (name) => {
		if (isSessionStorageSupport()) {
			return window.sessionStorage.getItem(name)
		}
	},

	clearAllcache: () => {
		if (isSessionStorageSupport() && isLocalStorageSupport()) {
			window.sessionStorage.clear()
			window.localStorage.clear()
		}
	},
}