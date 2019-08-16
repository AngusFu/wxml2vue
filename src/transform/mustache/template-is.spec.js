const proccess = require('../../proccess')
const attrBindingsPlugin = require('./attrs')
const templateIsPlugin = require('./template-is')

it('should parse <template is="name" data="*"></template>', async () => {
  const array = [
    [
      `<template is="objectCombine" data="{{for: a, bar: b}}"></template>`,
      '<template is="objectCombine" v-bind="{ for: a, bar: b }"></template>'
    ],
    [
      `<template is="objectCombine" data="{{...obj1, ...obj2, e: 5}}"></template>`,
      `<template is="objectCombine" v-bind="{ ...obj1, ...obj2, e: 5 }"></template>`
    ],
    [
      `<template is="objectCombine" data="{{foo, bar}}"></template>`,
      `<template is="objectCombine" v-bind="{ foo, bar }"></template>`
    ],
    [
      `<template is="objectCombine" data="{{...obj1, ...obj2, a, c: 6}}"></template>`,
      `<template is="objectCombine" v-bind="{ ...obj1, ...obj2, a, c: 6 }"></template>`
    ],
    [
      `<template is="staffName" data="{{...staffA}}"></template>`,
      `<template is="staffName" v-bind="{ ...staffA }"></template>`
    ],
    [
      `<template is="{{staffName}}" data="{{...staffA}}"></template>`,
      `<template :is="staffName" v-bind="{ ...staffA }"></template>`
    ],
    [
      `<template is="{{staffName + 222}}" data="{{...staffA}}"></template>`,
      `<template :is="staffName + 222" v-bind="{ ...staffA }"></template>`
    ],
    [
      `<template is="staff-{{id}}" data="{{...staffA}}"></template>`,
      `<template :is="\`staff-\${id}\`" v-bind="{ ...staffA }"></template>`
    ],
    [
      // 小程序不支持在模板内使用 template literals
      `<template is="staff-{{id}}" data="{{...xxxxxxx, x: x[eeee+ 'c'] ? c : 22}}"></template>`,
      `<template :is="\`staff-\${id}\`" v-bind="{ ...xxxxxxx, x: x[eeee+ 'c'] ? c : 22 }"></template>`
    ]
  ]

  for (const [input, expected] of array) {
    const { contents } = await proccess(input, [
      attrBindingsPlugin,
      templateIsPlugin
    ])
    expect(contents).toEqual(expected)
  }
})
