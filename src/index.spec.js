const wxml2vue = require('./index')

it('should work', async () => {
  let template = `
<template name="staffName">
  <view>
    FirstName: {{firstName}}, LastName: {{lastName}}
  </view>
</template>

<template is="staffName" data="{{...staffA}}"></template>
<template is="staffName" data="{{...staffB}}"></template>
<template is="staffName" data="{{...staffC}}"></template>

<view class="container">
  <view class="userinfo" bindtap="onTap">
    <button wx:if="{{!hasUserInfo && canIUse}}"> 获取头像昵称 </button>
    <block wx:else>
      <image src="{{userInfo.avatarUrl}}" background-size="cover"></image>
      <text class="userinfo-nickname">{{userInfo.nickName}}</text>
    </block>
  </view>
  <view class="usermotto">
    <text class="user-motto">{{motto}}</text>
  </view>
</view>

<view>
  <view> {{ message }} </view>
  <view> {{a + b}} + {{c}} + d </view>
  <view>{{"hello" + name}}</view>
  <view>{{object.key}} {{array[0]}}</view>
</view>
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
  {{idx}}: {{itemName.message}}
</view>
`
  const file = await wxml2vue(template)
  expect('contents' in file).toBe(true)

  let node = null
  await wxml2vue(template, () => {
    return tree => (node = tree)
  })
  expect(node.type).toBe('root')
})

it('should support vfile', async () => {
  const vfile = require('to-vfile')
  const file = await wxml2vue(vfile({ contents: '{{ xxx }}' }))
  expect(file.contents).toBe('{{ xxx }}')
})
