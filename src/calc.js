// 计算逆波兰表达式的值
// @param {string[]} rpn 逆波兰表达式 token 列表
// @returns {number} 计算结果
export default function calc(rpnTokens, opt) {
  const stack = []
  const len = rpnTokens.length
  let position = -1
  let result = 0

  for (let i = 0; i < len; i++) {
    const token = rpnTokens[i]

    if (opt.isNumber(token)) {
      position++
      stack[position] = token
      continue
    }

    const op = opt.operators[token]
    if (!op) throw new Error(`运算符(${token})未定义`)    

    // 操作数字符串转数值
    const left = +stack[position - 1]
    const right = +stack[position]
    stack[--position] = op.calc(left, right)
  }

  result = stack[position]
  return result
}
