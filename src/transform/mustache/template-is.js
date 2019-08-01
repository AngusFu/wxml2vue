/**
 * 转换 <template is="x" data="{{ ... }}" > 中的 data 插值
 */
const assert = require('assert')
const { selectAll } = require('unist-util-select')
const mustache = require('../../lib/mustache')

module.exports = function() {
  return transformer

  function transformer(tree) {
    const templates = selectAll('element[tagName=template]', tree)

    templates.forEach(node => {
      const { properties } = node
      if (properties.data) {
        const dataNode = mustache.parse(properties.data)
        assert(
          dataNode.length === 1 && dataNode[0][0] === 'name',
          `Invalid attribute data: ${properties.data}`
        )
        properties.data = null
        properties['v-bind'] = `{ ${dataNode[0][1].trim()} }`
      }
    })
  }
}
