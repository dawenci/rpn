const pkg = require('../package.json')
const version = process.env.VERSION || pkg.version
module.exports = '/*!\n' + ' * rpn.js v' + version + '\n' + ' * (c) ' + new Date().getFullYear() + ' dawenci.' + ' */\n'
