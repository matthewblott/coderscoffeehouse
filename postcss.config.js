import tailwindcss from 'tailwindcss'
import importer from 'postcss-import'
import cssnano from 'cssnano'

export default {
  plugins: [
    importer,
    tailwindcss({ config: './tailwind.config.js' }),
    cssnano,
  ]
}
