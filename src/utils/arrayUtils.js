// 数组对象
import { isArray } from './objectUtils'

// 判断某项是否在数组内
export const itemInArray = (item, array, index) => {
	if (!isArray(array)) {
		return console.error(array, '非数组')
	}

	let i = array.length

	// 存在下标
	if (index) {
		while(i--) {
			if (item === array[i][index]) {
				return i
			}
		}
	} else {
		while(i--) {
			if (item === array[i]) {
				return i
			}
		}
	}
	return null
}