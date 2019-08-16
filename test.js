const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
// const generate = require('@babel/generator').default

const expr = `[ \`www-\${x}\`, { ...xxxxxxx, x: x[\`\${eeee+ 'c'}\`] ? c : 22 }, [xx, ...yy, 'ww'] ]`

// 向上逐层解决即可
console.log(getIndentifiersFromExpression(expr))

function getIndentifiersFromExpression(expr) {
  let globals = null
  traverse(parse(expr), {
    enter(path) {
      if (!globals) {
        globals = Object.keys(path.scope.globals)
      } else {
        path.stop()
      }
    }
  })
  return globals
}
