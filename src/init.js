// Reverse Polish notation

import { merge } from './utils'
import _toRpn from './toRpn'
import _calc from './calc'
import _defaultOptions from './defaultOptions'

export default function init(options = {}) {
  const opt = merge(_defaultOptions, options)

  function toRpn(infixTokens) {
    return _toRpn(infixTokens, opt)
  }

  function calc(rpnTokens) {
    return _calc(rpnTokens, opt)
  }

  return {
    toRpn,
    calc,
  }
}
