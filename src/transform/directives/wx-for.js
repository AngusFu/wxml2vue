// this file depends on `../mustache/directives.js`
const { omit } = require('lodash')
const visit = require('unist-util-visit')

module.exports = function() {
  return transformer

  function transformer(tree) {
    visit(tree, 'element', visitor)
    visit(tree, 'element', visitorKeyOnly)
  }

  function visitor(node) {
    const { directives } = node

    /* istanbul ignore next */
    if (!directives || !directives['for']) {
      return
    }

    const key = directives['key']
    const forVar = directives['for']
    const forItem = directives['for-item']
    const isSimpleFor = /^[^s\d][^\s]*$/.test(forVar)
    node.directives = omit(directives, ['for', 'for-item', 'for-index'])
    node.properties = node.properties || /* istanbul ignore next */ {}
    node.properties['v-for'] = [
      '(',
      forItem,
      ', ',
      directives['for-index'],
      ') in ',
      isSimpleFor ? forVar : `(${forVar})`
    ].join('')

    if (key) {
      node.properties[':key'] =
        key === '*this' ? forItem : `${forItem}['${key}']`
      node.directives.key = null
    }
  }

  function visitorKeyOnly(node) {
    const { directives } = node
    if (directives && directives.key) {
      node.properties['key'] = directives.key
    }
  }
}
