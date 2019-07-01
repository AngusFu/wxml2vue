const proccess = require('../../proccess')
const templateIsPlugin = require('./template-is')

it('should parse <template is="name" data="*"></template>', async () => {
  const array = [
    [
      `<template is="objectCombine" data="{{for: a, bar: b}}"></template>`,
      '<template is="objectCombine" :data="{ for: a, bar: b }"></template>'
    ],
    [
      `<template is="objectCombine" data="{{...obj1, ...obj2, e: 5}}"></template>`,
      `<template is="objectCombine" :data="{ ...obj1, ...obj2, e: 5 }"></template>`
    ],
    [
      `<template is="objectCombine" data="{{foo, bar}}"></template>`,
      `<template is="objectCombine" :data="{ foo, bar }"></template>`
    ],
    [
      `<template is="objectCombine" data="{{...obj1, ...obj2, a, c: 6}}"></template>`,
      `<template is="objectCombine" :data="{ ...obj1, ...obj2, a, c: 6 }"></template>`
    ]
  ]

  for (const [input, expected] of array) {
    const { contents } = await proccess(input, [templateIsPlugin])
    expect(contents).toEqual(expected)
  }
})
