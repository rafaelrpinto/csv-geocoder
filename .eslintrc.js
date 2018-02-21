module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb-base'],
  env: {
    node: true,
  },
  rules: {
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-await-in-loop': 'off',
  },
};
