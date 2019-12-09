// 获取栈顶元素
export const stackTop = (stack) => stack[stack.length - 1]

// 合并对象，只考虑普通对象，不处理数组等情况，
// 此外，函数也当作作为原始类型处理
export const merge = (() => {
  const has = Object.prototype.hasOwnProperty
  function _merge(output, to, from) {
    if (to == null && from == null) return output
    to = to == null ? {} : Object(to)
    from = from == null ? {} : Object(from)
  
    // 处理 to 的数据
    for (let prop in to) {
      const toVal = to[prop]
  
      // 如果是 from 中没有该属性，使用 to 的值
      if (!(prop in from)) {
        output[prop] = toVal
        continue
      }
  
      const fromVal = from[prop]
  
      // 如果 from 中的属性值是原始类型（ 包括 undefined ）或函数，则直接覆盖
      if (typeof fromVal !== 'object' || fromVal === null) {
        output[prop] = fromVal
        continue
      }
    
      // 对象合并
      output[prop] = _merge({}, toVal, fromVal)
    }
  
    // 处理 from 的数据
    for (let prop in from) {
      // 上一轮遍历 from 时，已经合并的值，直接跳过
      if (has.call(output, prop)) continue
      output[prop] = from[prop]
    }
   
    return output
  }

  return function merge(to, from) {
    return _merge({}, to, from)
  }
})()
