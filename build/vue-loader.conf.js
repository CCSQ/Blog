var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
	loaders: utils.cssLoaders({
		sourceMap: isProduction
			? config.build.productionSourceMap
			: config.dev.cssSourceMap,
		extract: isProduction
	}),
	// 以下内容将转换为模块
	transformToRequire: {
		video: 'src',
		source: 'src',
		img: 'src',
		image: 'xlink:href',
		audio: 'src'
	}
}
