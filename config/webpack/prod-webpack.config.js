var webpackBase = require('./base-webpack.config')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

webpackBase.plugins.push(new UglifyJSPlugin({
  minimize: true,
  mangle: true,
  compress: {
    warnings: false,
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
    screw_ie8: true
  },
  output: {
    comments: false
  },
  exclude: [/\.min\.js$/gi, /\.html$/gi]
}))

module.exports = function () {
  return Object.assign(webpackBase, {})
}
