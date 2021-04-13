module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  rules: {
    //就是这一句，禁用import和require必须出现在顶层作用域的验证规则
      "global-require": 0//这里应该0代表off之前写错了写成了false
  },
  plugins:[
    'vue'
  ]
}