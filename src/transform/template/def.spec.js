const proccess = require('../../proccess')
const attrBindingsPlugin = require('../mustache/attrs')
const templateIsPlugin = require('../mustache/template-is')
const templateRefPlugin = require('./def')

it('should parse <template is="name" data="*"></template>', async () => {
  const array = [
    [
      `<template name="A"><text id="w-{{x}}"> A template </text></template>`,
      '<template name="A"><text :id="`w-${x}`"> A template </text></template>'
    ]
  ]

  for (const [input, expected] of array) {
    const { contents } = await proccess(input, [
      attrBindingsPlugin,
      templateIsPlugin,
      templateRefPlugin
    ])
    expect(contents).toEqual(expected)
  }
})
