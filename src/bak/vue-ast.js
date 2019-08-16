const compiler = require('vue-template-compiler')

const template = `
<div v-if="wwwwww">{{xc}}: {{msg}}<span v-if="www" :data="[x, 22]">{{ www + xxx }}</span></div>
`
const sfc = compiler.parseComponent(`<template>${template}</template>`)

const astRes = compiler.compile(sfc.template.content, {
  comments: true,
  preserveWhitespace: false,
  shouldDecodeNewlines: true
})

astRes.ast.children.forEach(astNode => {
  console.log(astNode.sc)
})
console.log(astRes)
