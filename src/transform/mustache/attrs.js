/**
 * 普通的 attribute 插值转换
 */
const assert = require('assert')
const visit = require('unist-util-visit')
const mustache = require('mustache')

const reMustache = /{{\s*.+\s*}}/
const hasCurlyBraces = s => reMustache.test(s)

module.exports = function() {
  return transformer

  function transformer(tree) {
    visit(tree, 'element', visitor)
  }

  function visitor(node) {
    const { properties } = node

    // template should be treated with special care
    /* istanbul ignore next */
    if (node.type === 'template') {
      return
    }

    /* istanbul ignore next */
    if (!properties) {
      return
    }

    const entries = Object.entries(properties).filter(([, value]) =>
      hasCurlyBraces(value)
    )

    /* istanbul ignore next */
    if (!entries.length) return

    entries.forEach(([key, value]) => {
      const newKey = `:${key}`
      const result = mustache.parse(value)
      properties[key] = null

      if (result.length === 1 && result[0][0] === 'name') {
        properties[newKey] = result[0][1]
        return
      }

      assert(
        result.length > 1 &&
          result.every(([type]) => type === 'name' || type === 'text'),
        'Oooooooops, unexpected mustache parsing result:' + result.toString()
      )

      const segments = result.map(([type, value]) => {
        if (type === 'name') {
          return `\${${value}}`
        }
        return value
      })

      properties[newKey] = `\`${segments.join('')}\``
    })

    node.properties = { ...properties }
  }
}
