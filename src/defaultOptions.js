// 默认选项
export default Object.freeze({
  groupStart: '(',

  groupEnd: ')',

  isNumber: tok => /\d/.test(tok),

  // 默认操作符
  operators: Object.freeze({
    '+': {
      precedence: 1,
      associativity: 'left',
      calc: (a, b) => a + b
    },
  
    '-': {
      precedence: 1,
      associativity: 'left',
      calc: (a, b) => a - b
    },  
  
    '*': {
      precedence: 2,
      associativity: 'left',
      calc: (a, b) => a * b
    },
  
    '/': {
      precedence: 2,
      associativity: 'left',
      calc: (a, b) => a / b
    },
  
    '%': {
      precedence: 2,
      associativity: 'left',
      calc: (a, b) => a % b
    },
  
    '^': {
      precedence: 3,
      associativity: 'right',
      calc: (a, b) => Math.pow(a, b)
    },
  })
})
