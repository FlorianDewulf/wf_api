var path = require('path')
var webpack = require('webpack')
// var helper = require('./helper')
var routes = require('../routes')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  watchOptions: {
    poll: true
  },
  devServer: {
    contentBase: './static',
    historyApiFallback: {
      index: 'default.html',
      rewrites: routes
    },
    hot: true
  },
  entry: {
    'app': [
      './src/main.js',
      './src/assets/stylesheets/index.scss'
    ]
  },
  output: {
    path: path.join(__dirname, '../../dist'),
    filename: '[name].js',
    libraryTarget: 'var',
    library: 'es6_library'
  },
  module: {
    rules: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader', 'sass-loader', 'postcss-loader' ]
        })
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader', 'postcss-loader' ]
        })
      },
      {
        test: /\.(jpg|png|svg|gif|jpeg)?$/,
        loader: 'url-loader',
        exclude: /node_modules/,
        query: {
          limit: 100000
        }
      }
    ]
  },
  plugins: [
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        if (typeof module.userRequest !== 'string') {
          return false
        }
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../../node_modules')
          ) === 0
        )
      }
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../static/report.html',
      openAnalyzer: false
    }),
    new ExtractTextPlugin({ // define where to save the file
      filename: 'app.css',
      allChunks: true
    })
  ]
}
