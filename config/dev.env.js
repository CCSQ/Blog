var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	api: '"/"',
	xs: '"768"',
	favicon: 'src/assets/img/favicon.ico'
})