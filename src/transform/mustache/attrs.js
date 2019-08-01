/**
 * 普通的 attribute 插值转换
 */
const assert = require('assert')
const visit = require('unist-util-visit')
const mustache = require('../../lib/mustache')

const { hasCurlyBraces } = require('../../utils/index')

module.exports = function() {
  return transformer

  function transformer(tree) {
    visit(tree, 'element', visitor)
  }

  function visitor(node) {
    const { properties } = node

    /* istanbul ignore next */
    if (!properties) {
      return
    }

    let entries = null
    // template should be treated with special care
    if (node.tagName === 'template') {
      const expr = properties.is
      if (expr && hasCurlyBraces(expr)) {
        entries = [['is', expr]]
      }
    } else {
      entries = Object.entries(properties).filter(([, value]) =>
        hasCurlyBraces(value)
      )
    }

    /* istanbul ignore next */
    if (!entries || !entries.length) return

    entries.forEach(([key, value]) => {
      const isClsn = key === 'className'
      const newKey = isClsn ? ':class' : `:${key}`
      const result = mustache.parse(isClsn ? [].concat(value).join(' ') : value)
      properties[key] = null

      if (result.length === 1 && result[0][0] === 'name') {
        properties[newKey] = result[0][1]
        return
      }

      assert(
        result.length > 1 &&
          result.every(([type]) => type === 'name' || type === 'text'),
        'Oooooooops, unexpected mustache parsing result: ' + result.toString()
      )

      const segments = result.map(([type, value]) => {
        if (type === 'name') {
          return `\${${value}}`
        }
        return value
      })

      properties[newKey] = `\`${segments.join('')}\``
    })
  }
}
