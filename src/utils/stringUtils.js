// 字符串相关

// 字符串是否为空
export const stringIsNotNull = (string) => {
	return string != '' && string
}


// 替换字符串，通过序号%0-%n
export const replaceString = (string, ...values) => {
	for (let i = 0; i < values.length; i++) {
		string = string.replace('%'+i, values[i])
	}
	return string
}

// string => number
export const string2NumberInt = (string) => {
	let num = Number.parseInt(string)
	return num ? num : 0
}

// string => float
export const string2NumberFloat = (string) => {
	let num = Number.parseFloat(string)
	return num ? num : 0.0
}