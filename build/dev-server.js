require('./check-versions')() // 检测版本是否支持

var config = require('../config') // 获取配置文件

// 设置环境上下文为开发环境
if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn') // 打开网址或者是文件之类的工具
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware') // 代理中间件
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port // 设置端口号

// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser // 是否自动开启浏览器

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// 定义代理服务器到后台api（解决跨域问题，仅适合开发环境使用）
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

// 静态资源服务器，只用于开发环境，用于热更新，在此定义了整个项目的入口
var devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: webpackConfig.output.publicPath,
	quiet: true
})

// 实现浏览器的无刷新更新（hot reload）
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
	log: false,
	heartbeat: 2000
})

// force page reload when html-webpack-plugin template changes
// 当 html-webpack-plugin 模板更改时强制页面重新加载
compiler.plugin('compilation', function(compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
		hotMiddleware.publish({
			action: 'reload'
		})
		cb()
	})
})

// proxy api requests 中间件代理（解决跨域问题）
Object.keys(proxyTable).forEach(function(context) {
	var options = proxyTable[context]
	if (typeof options === 'string') {
		options = {
			target: options
		}
	}
	// 请求						目标主机
	app.use(proxyMiddleware(options.filter || context, options))
})

// history模式 ， 所有路径都会返回 index.html 文件
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// 设置服务端静态文件夹  ./static
// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
	// 新建代理对象，用于处理异步请求，当异步完成后，返回一个状态由给定value决定的Promise对象
var readyPromise = new Promise(resolve => {
	_resolve = resolve
})

console.log('> Starting dev server...')
	// devMiddleware启动完后触发的逻辑
devMiddleware.waitUntilValid(() => {
	console.log('> Listening at ' + uri + '\n')
		// when env is testing, don't need open it
	if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
		opn(uri)
	}
	_resolve()
})

var server = app.listen(port)

module.exports = {
	ready: readyPromise,
	close: () => {
		server.close()
	}
}