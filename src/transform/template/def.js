/**
 * 转换 <template name="x">
 */
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { selectAll } = require('unist-util-select')
const getPlugins = require('../../plugins')
const mustache = require('../../lib/mustache')
const { hasCurlyBraces } = require('../../utils/index')

let plugins = null

// warming up V8
{
  getIndentifiersFromExpr('warm_up_on_load')
}

module.exports = function() {
  return function transformer(tree) {
    if (!plugins) {
      plugins = getPlugins().map(f => f())
    }

    const templates = selectAll('element[tagName=template]', tree).filter(
      node => node.properties && node.properties.name
    )

    templates.forEach(node => {
      const content = node.content
      content && plugins.forEach(fn => fn(content))
    })

    // 1. template 作用域是封闭的，只有 v-if 会创建 local scope
    // 2. 因此只需要收集一次 Identifiers, 过滤掉 v-for 创建的本地变量即可
    templates.forEach(node => {
      const identifiers = collectIdentifiers(node.content, node)
      if (identifiers.length) {
        node.properties['scope'] = `{ ${identifiers.sort().join(', ')} }`
      }
    })
  }
}

function collectIdentifiers(node, parent, globals = []) {
  const { children, type } = node

  if (type === 'element' || type === 'text') {
    setNodeScope(node, parent)
    globals.push(...Object.keys(node.__scope))
  }

  if (children && children.length) {
    for (const child of children) {
      collectIdentifiers(child, node, globals)
    }
  }

  return [...new Set(globals)]
}

function setNodeScope(node, parent) {
  let expressions = []

  if (node.type === 'text') {
    if (hasCurlyBraces(node.value)) {
      expressions = mustache
        .parse(node.value)
        .filter(seg => seg[0] === 'name')
        .map(seg => seg[1])
    }
  } else {
    const props = (node || {}).properties || {}
    expressions = Object.keys(props)
      // 可能有绑定的地方 /^(v-)|([:@])/
      .filter(k => /^(v-)|([:@])[a-zA-Z_-\d]+/.test(k))
      .map(key => props[key])
  }

  const parentScope = parent ? parent.__scope : null
  const parentLoopScope = parent ? parent.__loopScope : null
  const scope = { ...parentScope }
  const loopScope = { ...parentLoopScope }

  if (node.__forItem) {
    loopScope[node.__forItem] = 1
  }
  if (node.__forIndex) {
    loopScope[node.__forIndex] = 1
  }

  node.__scope = scope
  node.__loopScope = loopScope

  for (const expr of expressions) {
    const identifiers = getIndentifiersFromExpr(expr)
    for (const id of identifiers) {
      if (loopScope[id] !== 1) {
        scope[id] = 1
      }
    }
  }
}

function getIndentifiersFromExpr(expr) {
  // object 需要包装一层否则报错
  if (expr.startsWith('{') && expr.endsWith('}')) {
    expr = `(${expr})`
  }

  let globals = null

  try {
    const ast = parse(expr)
    traverse(ast, {
      Program(path) {
        globals = Object.keys(path.scope.globals)
        path.stop()
      }
    })
  } catch (e) {
    console.error('Invalid expression: ', expr, e)
  }

  return globals || []
}
