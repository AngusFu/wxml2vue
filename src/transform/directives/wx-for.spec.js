const proccess = require('../../proccess')
const wxDirectivesPlugin = require('../mustache/directives')
const wxForPlugin = require('./wx-for')

it('should parse simple wx:for', async () => {
  const template = `<view wx:for="{{array}}">
  {{index}} {{item}}
</view>`
  const vfile = await proccess(template, [wxDirectivesPlugin, wxForPlugin])
  expect(vfile.contents).toBe(`<view v-for="(item, index) in array">
  {{index}} {{item}}
</view>`)
})

it('should parse wx:for with wx:for-item and wx:for-index', async () => {
  const template = `<view wx:for="{{array}}" wx:for-item="xxx" wx:for-index="yyy">
  {{index}} {{item}}
</view>`
  const vfile = await proccess(template, [wxDirectivesPlugin, wxForPlugin])
  expect(vfile.contents).toBe(`<view v-for="(xxx, yyy) in array">
  {{index}} {{item}}
</view>`)
})

it('should parse wx:for with wx:for-item', async () => {
  const template = `<view wx:for="{{array}}" wx:for-item="xxx">
  {{index}} {{item}}
</view>`
  const vfile = await proccess(template, [wxDirectivesPlugin, wxForPlugin])
  expect(vfile.contents).toBe(`<view v-for="(xxx, index) in array">
  {{index}} {{item}}
</view>`)
})

it('should parse wx:for on complex expr', async () => {
  const template = `<view wx:for="{{ flag ? array : [1, 2, 3] }}" wx:for-item="xxx">
  {{index}} {{item}}
</view>`
  const vfile = await proccess(template, [wxDirectivesPlugin, wxForPlugin])
  expect(vfile.contents)
    .toBe(`<view v-for="(xxx, index) in (flag ? array : [1, 2, 3])">
  {{index}} {{item}}
</view>`)
})

it('should parse as string when wx:for got spaces at one end', async () => {
  const template = `<view wx:for="{{[1,2,3]}} ">
  {{index}} {{item}}
</view>`
  const vfile = await proccess(template, [wxDirectivesPlugin, wxForPlugin])
  expect(vfile.contents)
    .toBe(`<view v-for="(item, index) in (\`\${[1,2,3]} \`)">
  {{index}} {{item}}
</view>`)
})

it('should parse as string when wx:for expr is not curly wrapped', async () => {
  const template = `<view wx:for="array">
  {{index}} {{item}}
</view>`
  const vfile = await proccess(template, [wxDirectivesPlugin, wxForPlugin])
  expect(vfile.contents).toBe(`<view v-for="(item, index) in 'array'">
  {{index}} {{item}}
</view>`)
})

it('should parse wx:key as expected', async () => {
  const array = [
    [
      `<view wx:for="array" wx:key="w">{{item}}</view>`,
      `<view v-for="(item, index) in 'array'" :key="item['w']">{{item}}</view>`
    ],
    [
      `<view wx:for="array" wx:for-item="ww" wx:key="w">{{ww}}</view>`,
      `<view v-for="(ww, index) in 'array'" :key="ww['w']">{{ww}}</view>`
    ],
    [
      `<view wx:for="array" wx:key="*this">{{item}}</view>`,
      `<view v-for="(item, index) in 'array'" :key="item">{{item}}</view>`
    ],

    // edge cases
    [`<view wx:key="*this"></view>`, `<view key="*this"></view>`],
    [`<view wx:key="xxxx"></view>`, `<view key="xxxx"></view>`],

    // official demo
    [
      `<switch wx:for="{{objectArray}}" wx:key="unique"> {{item.id}} </switch>
<switch wx:for="{{numberArray}}" wx:key="*this"> {{item}} </switch>
`,
      `<switch v-for="(item, index) in objectArray" :key="item['unique']"> {{item.id}} </switch>
<switch v-for="(item, index) in numberArray" :key="item"> {{item}} </switch>
`
    ]
  ]

  for (const [input, expected] of array) {
    const vfile = await proccess(input, [wxDirectivesPlugin, wxForPlugin])
    expect(vfile.contents).toBe(expected)
  }
})
