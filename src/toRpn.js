import { stackTop } from './utils'

// Shunting-yard 算法
//
// 从左到右扫描中缀表达式的每个元素，根据遇到的不同元素，执行对应的逻辑：
//
// - case 1: 当前为操作数
//   直接输出操作数
//
// - case 2: 当前为运算符，且运算符栈空
//   运算符直接入栈
//
// - case 3: 当前为左括号
//   运算符直接入栈
//
// - case 4: 当前为右括号
//   运算符栈一直弹出并输出，直至遇到左括号。左括号弹出不输出，右括号舍弃不输出
//
// - case 5: 当前为运算符，且运算符栈非空
//   若栈顶是左括号，则停止比较，当前运算符直接入栈
//   若当前运算符优先级大于栈顶运算符，则停止比较，当前运算符直接入栈
//   若当前运算符与栈顶运算符相同，并且当前运算符是右结合的，则停止比较，当前运算符直接入栈
//   其他情况，将栈顶运算符出栈输出，回到 case 5，直至栈空时，将当前运算符入栈
//
// 中缀表达式扫描完毕之后，将运算符栈中的所有剩余运算符输出
//
// 算法结束
export default function toRpn(infixTokens, opt) {
  const len = infixTokens.length
  const output = []
  const opStack = []

  let index = -1
  while (++index < len) {
    const token = infixTokens[index]

    // case 1
    if (opt.isNumber(token)) {
      output.push(token)
      continue
    }

    // case 2
    // case 3
    if (!opStack.length || opt.groupStart === token) {
      opStack.push(token)
      continue
    }

    // case 4
    if (opt.groupEnd === token) {
      while (opStack.length) {
        const top = opStack.pop()
        if (opt.groupStart === top) break
        output.push(top)
      }
      continue
    }

    // assert operator
    const op = opt.operators[token]
    if (!op) throw new Error(`运算符(${token})未定义`)

    // case 5
    while (opStack.length) {
      if (opt.groupStart === stackTop(opStack)) break
      const top = stackTop(opStack)
      const topOp = opt.operators[top]
      if (op.precedence - topOp.precedence > 0) break
      if (token === top && topOp.associativity === 'right') break
      output.push(opStack.pop())
    }

    opStack.push(token)
  }

  // 将栈中所有剩余运算符输出
  while (opStack.length) {
    output.push(opStack.pop())
  }

  return output
}
