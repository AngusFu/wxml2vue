// https://github.com/syntax-tree/unist#list-of-utilities
const visit = require('unist-util-visit')
// const select = require('unist-util-select')

module.exports = wxmlTransform

function wxmlTransform() {
  return transformer

  function transformer(tree) {
    visit(tree, 'element', visitor)
  }

  function visitor(node) {
    console.log(node)
  }
}
