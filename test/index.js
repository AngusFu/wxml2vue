const { join, dirname } = require('path')
// const { ensureFileSync } = require('fs-extra')
const prettier = require('prettier')
const vfile = require('to-vfile')
const toHTML = require('hast-util-to-html')
const { selectAll } = require('unist-util-select')
const wxml2vue = require('../')

const htmlSettings = {
  quoteSmart: true,
  closeSelfClosing: true,
  omitOptionalTags: true,
  entities: { useShortestReferences: true }
}

const testFile = join(__dirname, 'fixtures/test.wxml')

transformFile(testFile).then(console.log)

function transformFile(path) {
  const cwd = dirname(path)
  const fs = new Map()
  const file = vfile.readSync(path, 'utf8')
  const plugin = function() {
    return tree => transform(tree, { cwd, fs })
  }

  return wxml2vue(file, plugin).then(file => {
    file.extname = '.vue'
    fs.set(file.path, file.contents)
    return fs
  })
}

function transform(tree, { cwd, fs }) {
  // step 1
  // TODO
  // * 标签替换
  // * <import /> and <include />

  // step 2
  // Vue 组件需要 root element
  // 所以可能需要包装一层
  fixRootElement(tree)
  // template 定义也需要包装
  const tmplDefs = selectAll('element[tagName=template]', tree)
  tmplDefs.forEach(tmpl => fixRootElement(tmpl.content))

  // step 3
  // template 定义 => template vfile
  makeTemplateFiles(tree, null, { cwd, fs })
}

// 这里和小程序有一定区别
// 小程序的同名 template 嵌套比较简单
// SEE https://gist.github.com/AngusFu/2aa3661e8286c413504886f8e8c7d27e
function makeTemplateFiles(node, parent, { fs, cwd }) {
  const { children } = node

  if (node.type === 'element' && node.tagName === 'template') {
    const name = node.properties.name

    if (parent) {
      parent.children[parent.children.indexOf(node)] = {
        type: 'comment',
        value: ` Template ${name} is moved to: ./${name}/index.vue `
      }
    }

    cwd = join(cwd, name)
    makeTemplateFiles(node.content, null, { cwd, fs })
    fs.set(join(cwd, 'index.vue'), makeVueComponent(node))
  } else if (children && children.length) {
    children.forEach(child => makeTemplateFiles(child, node, { fs, cwd }))
  }
}

function fixRootElement(tree) {
  const { children } = tree
  const elemCount = children.filter(
    node => node.type === 'element' && node.tagName !== 'template'
  ).length

  if (elemCount === 1) {
    if (
      children.filter(node => node.type === 'text' && node.value.trim())
        .length === 0
    ) {
      return
    }
  }

  const rootElement = {
    type: 'element',
    tagName: 'div',
    children
  }

  tree.children = [
    { type: 'text', value: '\n' },
    { type: 'comment', value: ' Tip: Vue SFC need a root element ' },
    rootElement,
    { type: 'text', value: '\n' }
  ]
}

function makeVueComponent(node) {
  const props = node.properties
  const { scope } = props

  let script = ''

  if (scope) {
    props.scope = null

    const propsDelc = scope
      .slice(1, -1)
      .trim()
      .split(/\s*,\s*/)
      .map(k => JSON.stringify(k))
      .join(', ')
    script = `
<script>
  export default {
    props: [${propsDelc}]
  }
</script>
`
  }

  return prettier.format(`${toHTML(node, htmlSettings)}\n${script}`, {
    parser: 'vue'
  })
}
