module.exports = Object.assign(
  {
    env: {
      browser: true,
      node: true,
      es6: true,
      jquery: true,
    },
    globals: {
      d3: true,
      dom: true,
    }
  },
  require('../.eslintrc')
)
