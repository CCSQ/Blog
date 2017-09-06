var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  api: '"http://127.0.0.1:3000/"',
  xs: '"768"'
})
