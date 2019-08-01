const proccess = require('../../proccess')
const attrBindingsPlugin = require('./attrs')

it('should treat string properties as it is', async () => {
  const template = `<view id="item" class="xxx"></view>`
  const { contents } = await proccess(template, [attrBindingsPlugin])
  expect(contents).toEqual('<view id="item" class="xxx"></view>')
})

it('should parse single expression in attr', async () => {
  const template = `<view id="{{ www + 2 }}"></view>`
  const { contents } = await proccess(template, [attrBindingsPlugin])
  expect(contents).toEqual('<view :id="www + 2"></view>')
})

it('should parse attr bindings: boolean', async () => {
  const template = `<checkbox checked="{{false}}"> </checkbox>`
  const { contents } = await proccess(template, [attrBindingsPlugin])
  expect(contents).toEqual('<checkbox :checked="false"> </checkbox>')
})

it('should parse attr bindings: ternary operation', async () => {
  const template = `<view hidden="{{flag ? true : false}}"> Hidden </view>`
  const { contents } = await proccess(template, [attrBindingsPlugin])
  expect(contents).toEqual(
    '<view :hidden="flag ? true : false"> Hidden </view>'
  )
})

it('should parse attr bindings: simple values', async () => {
  for (const val of [true, false, 220, 'hahh']) {
    const template = `<view id="{{${val}}}"> Hidden </view>`
    const { contents } = await proccess(template, [attrBindingsPlugin])
    expect(contents).toEqual(`<view :id="${val}"> Hidden </view>`)
  }
})

it('should parse attr bindings: string interpolation', async () => {
  const template = `<view id="item-{{id}}"></view>`
  const { contents } = await proccess(template, [attrBindingsPlugin])
  expect(contents).toEqual('<view :id="`item-${id}`"></view>')
})

it('should parse attr bindings: interpolations composed', async () => {
  const template = `<view id="w-{{item}}-sss-{{id}}-{{222}}-{{ x && y || z }}"></view>`
  const { contents } = await proccess(template, [attrBindingsPlugin])
  expect(contents).toEqual(
    '<view :id="`w-${item}-sss-${id}-${222}-${x && y || z}`"></view>'
  )
})

it('should treat space as it is', async () => {
  const template = `<view id=" {{item}} "></view>`
  const { contents } = await proccess(template, [attrBindingsPlugin])
  expect(contents).toEqual('<view :id="` ${item} `"></view>')
})

it('should treat class name carefully', async () => {
  const template = `<view class="kind-list-item-hd {{item.open ? 'kind-list-item-hd-show' : ''}}"></view>`
  const { contents } = await proccess(template, [attrBindingsPlugin])
  const cls = `\`kind-list-item-hd \${item.open ? 'kind-list-item-hd-show' : ''}\``
  expect(contents).toEqual(`<view :class="${cls}"></view>`)
})

it('should parse <template is="*"></template>', async () => {
  const array = [
    [
      `<template is="objectCombine"></template>`,
      '<template is="objectCombine"></template>'
    ],
    [
      `<template is="{{staffName}}"></template>`,
      `<template :is="staffName"></template>`
    ],
    [
      `<template is="{{staffName + 222}}"></template>`,
      `<template :is="staffName + 222"></template>`
    ],
    [
      `<template is="staff-{{id}}"></template>`,
      `<template :is="\`staff-\${id}\`"></template>`
    ]
  ]

  for (const [input, expected] of array) {
    const { contents } = await proccess(input, [attrBindingsPlugin])
    expect(contents).toEqual(expected)
  }
})
