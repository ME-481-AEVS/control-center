module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    _: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'global-require': 'off',
    'arrow-parens': 'off',
    'func-names': 'off',
    'linebreak-style': 'off',
    'max-len': ['error', 120],
    'no-console': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'no-return-assign': 'off',
    'prefer-arrow-callback': 'off',
  },
};
