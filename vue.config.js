const { defineConfig } = require('@vue/cli-service')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = defineConfig({
  publicPath: './',
  transpileDependencies: true,
  configureWebpack: {
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            // 删除注释
            output: {
              comments: false
            },
            compress: {
              drop_console: true, //删除所有调式带有console的
              drop_debugger: true,
              pure_funcs: ['console.log'] //删除console.log
            }
          }
        })
      ]
    },
  },
})
