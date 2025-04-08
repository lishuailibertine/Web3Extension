   // vue.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  publicPath: './',
  outputDir: 'dist', // 输出目录
  configureWebpack: {
    output: {
      filename: '[name].js'
    },
    optimization: {
      minimize: false, 
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // 删除 console.log
            },
          },
        }),
      ],
    }
  }
}