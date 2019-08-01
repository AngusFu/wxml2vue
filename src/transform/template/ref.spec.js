const proccess = require('../../proccess')
const attrBindingsPlugin = require('../mustache/attrs')
const templateIsPlugin = require('../mustache/template-is')
const templateRefPlugin = require('./ref')

it('should parse <template is="name" data="*"></template>', async () => {
  const array = [
    [
      `<template is="objectCombine" data="{{for: a, bar: b}}"></template>`,
      '<component is="objectCombine" v-bind="{ for: a, bar: b }"></component>'
    ],
    [
      `<template is="objectCombine" data="{{...obj1, ...obj2, e: 5}}"></template>`,
      `<component is="objectCombine" v-bind="{ ...obj1, ...obj2, e: 5 }"></component>`
    ],
    [
      `<template is="objectCombine" data="{{foo, bar}}"></template>`,
      `<component is="objectCombine" v-bind="{ foo, bar }"></component>`
    ],
    [
      `<template is="objectCombine" data="{{...obj1, ...obj2, a, c: 6}}"></template>`,
      `<component is="objectCombine" v-bind="{ ...obj1, ...obj2, a, c: 6 }"></component>`
    ],
    [
      `<template is="staffName" data="{{...staffA}}"></template>`,
      `<component is="staffName" v-bind="{ ...staffA }"></component>`
    ],
    [
      `<template is="{{staffName}}" data="{{...staffA}}"></template>`,
      `<component :is="staffName" v-bind="{ ...staffA }"></component>`
    ],
    [
      `<template is="{{staffName + 222}}" data="{{...staffA}}"></template>`,
      `<component :is="staffName + 222" v-bind="{ ...staffA }"></component>`
    ],
    [
      `<template is="staff-{{id}}" data="{{...staffA}}"></template>`,
      `<component :is="\`staff-\${id}\`" v-bind="{ ...staffA }"></component>`
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
