module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  // 这里可以进行自定义规则配置
  // key:规则代号
  // value: 具体的限定方式
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'space-before-function-paren':'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
