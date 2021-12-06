const tailwindcss = require('tailwindcss')
const importer = require('postcss-import')
const cssnano = require('cssnano')

module.exports = {
  plugins: [
    importer,
    tailwindcss({ config: './tailwind.config.js' }),
    cssnano,
  ]
}