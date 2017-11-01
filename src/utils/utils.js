
import {animationFrame} from './compatible'	// 兼容模块

import {audio_visualizer} from './audioVisualizer'

import { stringIsNotNull, replaceString, string2NumberInt, string2NumberFloat } from './stringUtils'

import { isFunction, isNumber, isObject, isArray, isString, isEmpty, object2Url, dataURL2Blob } from './objectUtils'

import { itemInArray } from './arrayUtils'

import { canvas_particle } from './canvasParticle'

import { canvas_draw } from './canvasDraw'

import { jsonString2jsonObject } from './jsonUtils'

export default{
	install(Vue,options)
	{
		Vue.prototype.utils = function () {}

		Vue.prototype.utils.isFunction = isFunction
		Vue.prototype.utils.animationFrame = animationFrame
		Vue.prototype.utils.replaceString = replaceString
		Vue.prototype.utils.itemInArray = itemInArray
		Vue.prototype.utils.string2NumberInt = string2NumberInt
		Vue.prototype.utils.isEmpty = isEmpty
		Vue.prototype.utils.isString = isString
		Vue.prototype.utils.isObject = isObject
		Vue.prototype.utils.isArray = isArray
		Vue.prototype.utils.object2Url = object2Url
		Vue.prototype.utils.dataURL2Blob = dataURL2Blob
		Vue.prototype.utils.stringIsNotNull = stringIsNotNull
		Vue.prototype.utils.jsonString2jsonObject = jsonString2jsonObject

		// 音频相关类
		Vue.prototype.audio_visualizer = audio_visualizer
		// canvas 相关，粒子系统
		Vue.prototype.canvas_particle = canvas_particle
		// canvas 画笔相关
		Vue.prototype.canvas_draw = canvas_draw
	}
}