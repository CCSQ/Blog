var path = require('path')
var fs = require('fs')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

// 拼接成绝对路径
function resolve (dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	entry: {  // 入口
		app: './src/main.js'
	},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production'
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPath
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src'),
		},
		symlinks: false
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('test')]
			},
			{ test: /iview.src.*?js$/, loader: 'babel-loader' },
			// build/utils.js 已经加载css了，无需再进行加载
			// {
			//   test: /\.css$/,
			//   loader: 'style-loader!css-loader'
			// },
			// 加载less文件
			{test: /\.less$/, loader: 'style!css!less'},

			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	}
}
