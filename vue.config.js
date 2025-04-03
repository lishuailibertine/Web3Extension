module.exports = {
  publicPath: './',
  outputDir: 'dist', // 输出目录
  configureWebpack: {
    output: {
      filename: '[name].js'
    }
  }
}