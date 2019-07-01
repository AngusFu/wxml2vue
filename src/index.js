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
  <view class="userinfo">
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

// 0. 注意针对 template content 的处理
// 1. text 中的插值: keep as it is
// 2. property 插值:
//    2.1 wx:for wx:if => directives
//    2.2 normal properties
// 3. <template is="{{name}}"></template>
// 4. <import /> and <include/>
// 5. Tagname 修改

const proccess = require('./proccess')

proccess(template, [
  require('./transform/mustache/text'),
  require('./transform/mustache/template-is'),
  require('./transform/mustache/directives'),
  require('./transform/mustache/attrs'),
  require('./transform/directives/wx-for')
])
  .then(file => {
    console.log(file.contents)
  })
  .catch(e => {
    console.error(proccess.report(e))
  })
