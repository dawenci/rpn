import { stackTop } from './utils'

// Shunting-yard 算法
// 
// case 1: 遇到操作数
// 直接输出
//  
// case 2：遇到运算符，运算符为左括号，或此时运算符栈空或栈顶是左括号
// 当前运算符直接入栈
// 
// case 3：遇到右括号
// 3.1 运算符栈一直弹出并输出，直至遇到左括号
// 3.2 将左括号也弹出但不用输出
// 3.3 右括号也不用输出，直接扔掉
// 
// case 4: 遇到运算符，此时运算符栈非空
// 4.1 若栈顶是左括号，则停止比较，当前运算符直接入栈
// 
// 4.2 若符合以下任一情况：
// 4.2.1. 当前运算符优先级低于或等于栈顶运算符
// 4.2.2. 当前运算符和栈顶运算符一样，且为左结合
// 则：
// 将栈顶运算符出栈输出，然后当前运算符继续与新栈顶比较
// 
// 4.3 其他情况当前运算符入栈
//
// 算法结束
export default function toRpn(infixTokens, opt) {
  const len = infixTokens.length
  const output = []
  const opStack = []

  let index = 0
  while (index < len) {
    const token = infixTokens[index]

    // case 1
    if (opt.isNumber(token)) {
      output.push(token)
      index += 1
      continue
    }

    // assert operator
    const op = opt.operators[token]
    if (!op) {
      throw new Error(`运算符(${token})未定义`)
    }

    // case 2
    if (!opStack.length
      || opt.groupStart === token
      || opt.groupStart === (stackTop(opStack))
    ) {
      opStack.push(token)
      index += 1
      continue
    }

    // case 3
    if (opt.groupEnd === token) {
      while (opStack.length) {
        const top = opStack.pop()
        if (opt.groupStart === top) break
        output.push(top)
      }
      index += 1
      continue
    }

    // case 4
    while (opStack.length) {
      if (opt.groupStart === stackTop(opStack)) break
      const top = stackTop(opStack)
      const topOp = opt.operators[top]
      if (op.precedence - topOp.precedence > 0) break
      if (token === top && topOp.associativity === 'right') break
      output.push(opStack.pop())
    }

    opStack.push(token)
    index += 1
  }

  // 将栈中所有剩余运算符输出
  while (opStack.length) {
    output.push(opStack.pop())
  }

  return output
}
