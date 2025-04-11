   // vue.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  publicPath: './',
  outputDir: 'dist', // 输出目录
  pages: {
    app: {
      entry: 'src/app/main.js',
      template: 'public/app/index.html',
      filename: 'index.html'
    },
    requestLogin: {
      entry: 'src/requestLogin/requestLogin.js',
      template: 'public/requestLogin/requestLogin.html',
      filename: 'requestLogin.html'
    },
  },
  css: {
    extract: {
      filename: "css/[name].css",          // 输出 css 路径
      chunkFilename: "css/[name].css"
    }
  },
  configureWebpack: {
    output: {
      filename: "js/[name].js",            // 输出 js 路径
      chunkFilename: "js/[name].js"
    },
    optimization: {
      minimize: false, 
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: false, // 删除 console.log
            },
          },
        }),
      ],
    }
  }
}