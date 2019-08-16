const proccess = require('../../proccess')
const attrBindingsPlugin = require('../mustache/attrs')
const templateIsPlugin = require('../mustache/template-is')
const templateRefPlugin = require('./def')

it('should parse <template is="name" data="*"></template>', async () => {
  const array = [
    // [
    //   `<template name="A"><text id="w-{{x}}"> A template </text></template>`,
    //   '<template name="A"><text :id="`w-${x}`"> A template </text></template>'
    // ],
    [
      `<template name="A">
        <div wx:if="{{x}}" ww="{{eee}}">
          <span class="w-{{y}}"></span>
          {{ z[w + '___'] }}
          {{ a > 0 ? xxx : yyy }}
          {{ [xx, ...yy, "ww"] }}
          <template is="A" data="{{ ...xxxxxxx, x: x[eeee+ 'c'] ? c : 22 }}"></template>
        </div>
</template>`,
      ''
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
