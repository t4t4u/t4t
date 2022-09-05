const lint = 'eslint --fix'
const format = 'prettier --write'
const both = [lint, format]

module.exports = {
  '*.ts': both,
  '.*rc.js': both,
  '*.{json,md}': format,
}
