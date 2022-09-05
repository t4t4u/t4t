module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
  extends: ['standard-with-typescript', 'prettier'],
  parserOptions: {
    project: 'tsconfig.eslint.json',
  },
  ignorePatterns: ['coverage', 'dist', 'docs'],
  rules: {
    'max-depth': 'warn',
    'max-lines': 'warn',
    'max-lines-per-function': 'warn',
    'max-params': 'warn',
    'max-statements': 'warn',
    'no-warning-comments': 'warn',
    'tsdoc/syntax': 'error',
  },
}
