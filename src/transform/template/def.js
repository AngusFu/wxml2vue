/**
 * 转换 <template name="x">
 */
const { selectAll } = require('unist-util-select')
const getPlugins = require('../../plugins')

let plugins = null

module.exports = function() {
  return function transformer(tree) {
    if (!plugins) {
      plugins = getPlugins().map(f => f())
    }

    // TODO 下面这个选择方式没有解决 template 之间嵌套的问题
    const templates = selectAll('element[tagName=template]', tree).filter(
      node => node.properties && node.properties.name
    )

    templates.forEach(node => {
      const content = node.content
      content && plugins.forEach(fn => fn(content))
    })

    templates.forEach(node => {
      const rootNode = node.content

      // TODO 解决纯文本节点
      if (!rootNode.children) {
        rootNode.children = [{ type: 'element', tagName: 'div' }]
      } else if (rootNode.children.length > 1) {
        rootNode.children = [
          { type: 'element', tagName: 'div', children: rootNode.children }
        ]
      }

      // 深度遍历每个节点 解决可能有绑定的地方 /^(v-)|([:@])/
      const rootChild = rootNode.children[0]
      const props = rootChild.properties || {}
      const keysWithBindings = Object.keys(props).filter(k =>
        /^(v-)|([:@])[a-zA-Z_-\d]+/.test(k)
      )
      keysWithBindings.forEach(key => {
        console.log(props[key])
      })
    })
  }
}
