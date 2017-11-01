// 对象相关
import {stringIsNotNull} from './stringUtils'

// 工具函数，检测是否是函数
export const isFunction = (object) => {
	return typeof object === "function"
}

// 是否数字
export const isNumber = (object) => {
	return typeof object === "number"
}

// 是否对象
export const isObject = (object) => {
	return typeof object === "object" && object instanceof Object && !isArray(object)
}

// 是否数组
export const isArray = (object) => {
	return object instanceof Array
}

// 是否字符串
export const isString = (object) => {
	return typeof object === "string"
}


// 是否为空
export const isEmpty = (object) => {
	// 判断空
	if(!object && object !== 0 && object !== '') return true

	// 对象
	if (isObject(object)) {
		if (JSON.stringify(object) === '{}') return true
		if (JSON.stringify(object) === '[]') return true
	}

	// 字符串
	if (!stringIsNotNull(object)) return true

	return false
}


// 对象转地址
export const object2Url = (object) => {
	return URL.createObjectURL(object)
}

// 数据url转blob对象
export const dataURL2Blob = (dataurl) => {
	let arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n)
	while(n--){
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new Blob([u8arr], {type:mime})
}