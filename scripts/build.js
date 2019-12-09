const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const zlib = require('zlib')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const replace = require('@rollup/plugin-replace')
const uglify = require('uglify-js')
const pkg = require('../package.json')
const banner = require('./banner')

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }
    fs.writeFile(dest, code, (err) => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      }
      else {
        report()
      }
    })
  })
}

Promise.resolve().then(buildESM).then(buildCJS).then(buildBrowser).catch(logError)

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }
    fs.writeFile(dest, code, (err) => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      }
      else {
        report()
      }
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
  console.log(e)
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

// 编译 esm 版本
function buildESM() {
  fse.ensureDirSync('dist/esm')
  return rollup
  .rollup({
    input: 'src/index.js',
  })
  .then(function(bundle) {
    return bundle.generate({
      format: 'es',
      name: 'Rpn',
      banner: banner
    })
  })
  .then(({ code }) => {
    code = banner + '\n' + code
    return write(pkg.module, code, true)
  })
  .then(() => {
    console.log(blue('esm...') + ' done.')    
  })
}

// 编译 commonJS 版本
function buildCJS() {
  fse.ensureDirSync('dist/cjs')
  return rollup
  .rollup({
    input: 'src/index.js',
    plugins: [
      replace({ 'process.env.NODE_ENV': "'production'" }),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  })
  .then(function(bundle) {
    return bundle.generate({
      format: 'cjs',
      name: 'Rpn',
      banner: banner
    })
  })
  .then(({ code }) => {
    code = banner + '\n' + code
    return write(pkg.main, code, true)
  })
  .then(() => {
    console.log(blue('cjs...') + ' done.')    
  })
}

// browser 产品版 (bundle)
function buildBrowser() {
  fse.ensureDirSync('dist')
  return rollup
    .rollup({
      input: 'src/index.js',
      plugins: [
        replace({ 'process.env.NODE_ENV': "'production'" }),
        babel({
          exclude: 'node_modules/**'
        })
      ]
    })
    .then(function(bundle) {
      return bundle.generate({
        format: 'iife',
        name: 'Rpn',
        banner: banner
      })
    })
    .then(({ code }) => {
      var result = uglify.minify(code, {})
      var minified = result.code
      // var map = result.map
      minified = banner + '\n' + minified
      return write(pkg.browser, minified, true)
    })
}
