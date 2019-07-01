// https://github.com/syntax-tree/unist#list-of-utilities

// 注意区分 template 和 element 不同
const visit = require('unist-util-visit')
// const selectAll = require('unist-util-select').selectAll

module.exports = wxmlTransform

function wxmlTransform() {
  return transformer

  function transformer(tree) {
    visit(tree, 'element', visitor)
  }

  function visitor(node) {
    const { properties } = node
    if (properties) {
      // Object.keys(properties).filter(/^wx/)
    }
  }
}
