// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {}
  }
}

module.exports = {
  plugins: {
    "postcss-px-to-viewport": {
      // 常用配置，更多配置参考官方
      // 需要转换的单位
      unitToConvert: 'px',
      // 设计稿的视口宽度
      viewportWidth: 375,
      // 单位转换后保留的精度
      unitPrecision: 5,
    }
  }
}
