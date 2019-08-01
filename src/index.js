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

// https://github.com/wechat-miniprogram/miniprogram-demo/blob/master/miniprogram/page/cloud/index.wxml
template = `<view class="index">
  <view class="index-hd">
    <image class="index-logo" src="resources/kind/logo.png"></image>
    <view class="index-desc">以下将演示小程序云开发能力，具体属性参数详见 <navigator url="pages/doc-web-view/doc-web-view" class="weui-agree__link">小程序开发文档</navigator>。</view>
  </view>
  <view class="index-bd">
    <view class="kind-list">
      <block wx:for-items="{{list}}" wx:key="{{item.id}}">
        <view class="kind-list-item">
          <view id="{{item.id}}" class="kind-list-item-hd {{item.open ? 'kind-list-item-hd-show' : ''}}" bindtap="kindToggle">
            <view class="kind-list-text">{{item.name}}</view>
            <image class="kind-list-img" src="resources/kind/{{item.id}}.png"></image>
          </view>
          <view class="kind-list-item-bd {{item.open ? 'kind-list-item-bd-show' : ''}}">
            <view class="navigator-box {{item.open ? 'navigator-box-show' : ''}}">
              <block wx:for-items="{{item.pages}}" wx:for-item="page" wx:key="*item">
                <navigator url="pages/{{page.url}}" class="navigator">
                  <view class="navigator-text">{{page.zh}}</view>
                  <view class="navigator-arrow"></view>
                </navigator>
              </block>
            </view>
          </view>
        </view>
      </block>
    </view>
  </view>
</view>
`
// 0. 注意针对 template content 的处理
// 1. text 中的插值: keep as it is
// 2. property 插值:
//    2.1 wx:for wx:if => directives
//    2.2 normal properties
// 3. <template is="{{name}}"></template>
// 4. <import /> and <include/>
// 5. Tagname 修改: Adaptor

const proccess = require('./proccess')
const plugins = require('./plugins')

proccess(template, plugins)
  .then(file => {
    console.log(file.contents)
  })
  .catch(e => {
    console.error(proccess.report(e))
  })
