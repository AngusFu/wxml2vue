/**
 * 转换 <template name="x">
 */
const visit = require('unist-util-visit')
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
      } else {
        const elems = rootNode.children.filter(isElement)
        if (elems.length > 1) {
          rootNode.children = [
            { type: 'element', tagName: 'div', children: rootNode.children }
          ]
        }
      }

      // TODO 纯文本节点也可能有 binding
      visit(rootNode, 'element', node => {
        console.log(getBindings(node))
      })
    })
  }
}

function getBindings(node) {
  const props = (node || {}).properties || {}
  return [
    ...new Set(
      Object.keys(props)
        // 可能有绑定的地方 /^(v-)|([:@])/
        .filter(k => /^(v-)|([:@])[a-zA-Z_-\d]+/.test(k))
        .reduce(
          (acc, key) => [...acc, ...getIndentifiersFromExpression(props[key])],
          []
        )
    )
  ]
}

function getIndentifiersFromExpression(expr) {
  const { parse } = require('@babel/parser')
  const traverse = require('@babel/traverse').default

  // object 需要包装一层否则报错
  if (expr.startsWith('{') && expr.endsWith('}')) {
    expr = `(${expr})`
  }

  let globals = null
  try {
    const ast = parse(expr)
    traverse(ast, {
      enter(path) {
        if (!globals) {
          globals = Object.keys(path.scope.globals)
        } else {
          path.stop()
        }
      }
    })
  } catch (e) {
    console.error('Invalid expression: ', expr, e)
  }
  return globals || []
}

function isElement(node) {
  return node.type === 'element'
}
