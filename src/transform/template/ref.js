/**
 * 转换 <template is="x" data="{{ ... }}">
 */
const { selectAll } = require('unist-util-select')

module.exports = function() {
  return transformer

  function transformer(tree) {
    const templates = selectAll('element[tagName=template]', tree)
    templates.forEach(node => {
      const { properties } = node
      if (properties.is || properties[':is']) {
        node.tagName = 'component'
      }
    })
  }
}
