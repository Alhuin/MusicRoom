module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'jest': true,
  },
  'rules': {
    'no-use-before-define': 'off',
    'no-console': 'off',
    'no-alert': 'off',
    'no-underscore-dangle': 'off',
  },
  'globals': {
    "fetch": false
  }
};