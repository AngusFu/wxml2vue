/**
 * bindevent => @event
 */
const visit = require('unist-util-visit')

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

    const reBind = /^bind([a-z]+)/
    const keys = Object.keys(properties)
    for (const key of keys) {
      if (reBind.test(key)) {
        properties[`@${RegExp.$1}`] = properties[key]
        properties[key] = null
      }
    }
  }
}
