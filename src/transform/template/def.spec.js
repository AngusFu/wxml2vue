const proccess = require('../../proccess')
const attrBindingsPlugin = require('../mustache/attrs')
const templateIsPlugin = require('../mustache/template-is')
const templateRefPlugin = require('./def')

it('should parse <template is="name" data="*"></template>', async () => {
  const array = [
    // no interpolation
    [
      `<template name="A"><div>2222</div></template>`,
      `<template name="A"><div>2222</div></template>`
    ],
    // simple attr interpolation
    [
      `<template name="A"><text id="w-{{x}}"> A template </text></template>`,
      '<template name="A" slot-scope="{ x }"><text :id="`w-${x}`"> A template </text></template>'
    ],
    // simple text interpolation
    [
      `<template name="A"><div>{{ www }}<span>w-{{ yyy }}</span></div></template>`,
      `<template name="A" slot-scope="{ www, yyy }"><div>{{ www }}<span>w-{{ yyy }}</span></div></template>`
    ],
    // complex text interpolation
    [
      `<template name="A"><div>{{ z[w + '___'] }}</div></template>`,
      `<template name="A" slot-scope="{ w, z }"><div>{{ z[w + '___'] }}</div></template>`
    ],
    // simple wx:if directive
    [
      `<template name="A"><div wx:if="{{eee}}"></div></template>`,
      `<template name="A" slot-scope="{ eee }"><div v-if="eee"></div></template>`
    ],
    // complex wx:if directive
    [
      `<template name="A"><div wx:if="{{ eee ? x : y }}"></div></template>`,
      `<template name="A" slot-scope="{ eee, x, y }"><div v-if="eee ? x : y"></div></template>`
    ],
    //  simple wx:for directives
    [
      `<template name="A"><div wx:for="{{ array }}">{{item}}</div></template>`,
      `<template name="A" slot-scope="{ array }"><div v-for="(item, index) in array">{{item}}</div></template>`
    ],
    //  complex wx:for directives
    [
      `<template name="A"><div wx:for="{{ w ? array1 : [...array2, 100] }}"></div></template>`,
      `<template name="A" slot-scope="{ array1, array2, w }"><div v-for="(item, index) in (w ? array1 : [...array2, 100])"></div></template>`
    ],
    //  complex wx:for directives with wx-for-item and wx-for-index
    [
      `<template name="A">
        <div wx:for="{{ array }}" wx:for-item="it" wx:for-index="$index">{{it}}{{$index}}</div>
      </template>`,
      `<template name="A" slot-scope="{ array }">
        <div v-for="(it, $index) in array">{{it}}{{$index}}</div>
      </template>`
    ],
    // multiple child
    [
      `<template name="A">
        {{ xxx }}
        <div wx:for="{{ array }}" wx:for-item="it" wx:for-index="$index">{{it}}{{$index}}</div>
      </template>`,
      `<template name="A" slot-scope="{ array, xxx }">
        {{ xxx }}
        <div v-for="(it, $index) in array">{{it}}{{$index}}</div>
      </template>`
    ],
    // nest templates
    [
      `<template name="A">
        <div wx:for="{{ array }}" wx:for-item="it" wx:for-index="$index">{{it}}{{$index}}</div>
        <template name="B">
          <div class="x-{{ ccc }}">{{ bbb }} {{ array.length }}</div>
        </template>
        <template is="C" data="{{ ...xxx, x: xxx[eee + 'c'] ? ccc : 22 }}"></template>
      </template>`,
      `<template name="A" slot-scope="{ array, ccc, eee, xxx }">
        <div v-for="(it, $index) in array">{{it}}{{$index}}</div>
        <template name="B" slot-scope="{ array, bbb, ccc }">
          <div :class="\`x-\${ccc}\`">{{ bbb }} {{ array.length }}</div>
        </template>
        <component is="C" v-bind="{ ...xxx, x: xxx[eee + 'c'] ? ccc : 22 }"></component>
      </template>`
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
