const pkg = require('./package.json')
const babel = require('rollup-plugin-babel')

export default {
  input: './src/index.js',
  
  output: [
    {
      file: pkg.browser,
      format: 'iife',
      name: 'Rpn',
      sourcemap: false
    }
  ],

  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
}
