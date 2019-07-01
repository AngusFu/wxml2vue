/**
 * 转换 <template is="x" data="{{ ... }}" > 中的插值
 */
const assert = require('assert')
const mustache = require('mustache')
const { selectAll } = require('unist-util-select')

module.exports = function() {
  return transformer

  function transformer(tree) {
    const templates = selectAll('element[tagName=template]', tree).filter(
      node => {
        const p = node.properties
        // eslint-disable-next-line
        return p && p.is && p.data
      }
    )

    templates.forEach(node => {
      const { properties } = node
      const parsed = mustache.parse(properties.data)
      assert(
        parsed.length === 1 && parsed[0][0] === 'name',
        `Invalid attribute data: ${properties.data}`
      )

      properties.data = null
      properties[':data'] = `{ ${parsed[0][1].trim()} }`
    })
  }
}
