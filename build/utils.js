var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
	var assetsSubDirectory = process.env.NODE_ENV === 'production'
		? config.build.assetsSubDirectory
		: config.dev.assetsSubDirectory
	return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
	options = options || {}

	var cssLoader = {
		loader: 'css-loader',	// css解释器
		options: {
			minimize: process.env.NODE_ENV === 'production',	// 启用\禁用 压缩
			sourceMap: options.sourceMap	// 启用\禁用 Sourcemap
		}
	}

	// 加载各种css预处理装载器（转化成css后需添加css解释器）
	// generate loader string to be used with extract text plugin
	function generateLoaders (loader, loaderOptions) {
		var loaders = [cssLoader]
		if (loader) {
			loaders.push({
				loader: loader + '-loader',
				options: Object.assign({}, loaderOptions, {	// 合并配置
					sourceMap: options.sourceMap
				})
			})
		}

		// require 剥离成单独文件
		// 将从每一个用到了require("style.css")的entry chunks文件中抽离出css到单独的output文件
		// Extract CSS when that option is specified
		// (which is the case during production build)
		if (options.extract) {
			return ExtractTextPlugin.extract({
				use: loaders,
				fallback: 'vue-style-loader'
			})
		} else {
			return ['vue-style-loader'].concat(loaders)
		}
	}

	// 后缀： 解释器
	// https://vue-loader.vuejs.org/en/configurations/extract-css.html
	return {
		css: generateLoaders(),
		postcss: generateLoaders(),
		less: generateLoaders('less'),
		sass: generateLoaders('sass', { indentedSyntax: true }),
		scss: generateLoaders('sass'),
		stylus: generateLoaders('stylus'),
		styl: generateLoaders('stylus')
	}
}

// 对大多数css预处理进行了配置，具体配置在cssLoaders方法中，在vue文件之外的
// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
	var output = []
	var loaders = exports.cssLoaders(options)
	for (var extension in loaders) {
		var loader = loaders[extension]
		output.push({
			test: new RegExp('\\.' + extension + '$'),
			use: loader
		})
	}
	return output
}
