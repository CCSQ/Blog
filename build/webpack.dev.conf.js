var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')	// webpack 合并工具
var baseWebpackConfig = require('./webpack.base.conf')	// webpack 基础设置
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// 加入热更新入口（添加热更新入口文件）
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
	baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
	module: {
		// 加载样式加载器
		rules: utils.styleLoaders({
			sourceMap: config.dev.cssSourceMap
		})
	},
	// cheap-module-eval-source-map is faster for development
	devtool: '#cheap-module-eval-source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': config.dev.env
		}),
		// https://github.com/glenjamin/webpack-hot-middleware#installation--usage
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		// https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true,
			favicon: config.dev.env.favicon	// 添加favicon图标
		}),
		new FriendlyErrorsPlugin() // 友好错误提示插件
	]
})