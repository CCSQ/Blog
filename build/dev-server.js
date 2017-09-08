require('./check-versions')()	// ���汾�Ƿ�֧��

var config = require('../config')	// ��ȡ�����ļ�
// ���û���������Ϊ��������
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')	// ����ַ�������ļ�֮��Ĺ���
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')	// �����м��
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port	// ���ö˿ں�
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser	// �Ƿ��Զ����������
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// ����������������̨api
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

// ��̬��Դ��������ֻ���ڿ��������������ȸ��£��ڴ˶�����������Ŀ�����
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

// ʵ�����������ˢ�¸��£�hot reload��
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// �� html-webpack-plugin ģ�����ʱǿ��ҳ�����¼���
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests �м������
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
							// ����						Ŀ������
  app.use(proxyMiddleware(options.filter || context, options))
})

// historyģʽ �� ����·�����᷵�� index.html �ļ�
// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// ���÷���˾�̬�ļ���  ./static
// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
// �½�����������ڴ����첽���󣬵��첽��ɺ󣬷���һ��״̬�ɸ���value������Promise����
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
// devMiddleware������󴥷����߼�
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
