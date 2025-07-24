export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 16, // 根元素字体大小 (1rem = 16px)
      propList: ['*'], // 转换所有属性
      exclude: /node_modules/i, // 排除node_modules目录
      selectorBlackList: ['.no-rem'], // 不转换包含这些类名的选择器
      minPixelValue: 2, // 小于2px的值不转换
      replace: true, // 替换而不是添加备用属性
      mediaQuery: true, // 允许在媒体查询中转换px
      unitPrecision: 5 // rem单位的小数位数
    }
  }
}