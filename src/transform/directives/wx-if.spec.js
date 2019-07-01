const proccess = require('../../proccess')
const wxDirectivesPlugin = require('../mustache/directives')
const wxIfPlugin = require('./wx-if')

it('should work', async () => {
  const array = [
    [
      '<view wx:if="{{condition}}"> True </view>',
      '<view v-if="condition"> True </view>'
    ],
    [
      `<view wx:if="{{length > 5}}"> 1 </view>
<view wx:elif="{{length > 2}}"> 2 </view>
<view wx:else> 3 </view>
`,
      `<view v-if="length > 5"> 1 </view>
<view v-else-if="length > 2"> 2 </view>
<view v-else=""> 3 </view>
`
    ],

    [
      `<block wx:if="{{true}}">
  <view> view1 </view>
  <view> view2 </view>
</block>
`,
      `<block v-if="true">
  <view> view1 </view>
  <view> view2 </view>
</block>
`
    ],

    [
      `<view wx:if="{{view == 'WEBVIEW'}}"> WEBVIEW </view>
<view wx:elif="{{view == 'APP'}}"> APP </view>
<view wx:else="{{view == 'MINA'}}"> MINA </view>
`,
      `<view v-if="view == 'WEBVIEW'"> WEBVIEW </view>
<view v-else-if="view == 'APP'"> APP </view>
<view v-else-if="view == 'MINA'"> MINA </view>
`
    ]
  ]

  for (const [input, expected] of array) {
    const vfile = await proccess(input, [wxDirectivesPlugin, wxIfPlugin])
    expect(vfile.contents).toBe(expected)
  }
})
