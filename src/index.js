const template = `
<template name="staffName">
  <view>
    FirstName: {{firstName}}, LastName: {{lastName}}
  </view>
</template>

<  data="{{...staffA}}"></template>
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
`

// const compiler = require('vue-template-compiler')

// var sfc = compiler.parseComponent(`<template>${template}</template>`)

// const astRes = compiler.compile(sfc.template.content, {
//   comments: true,
//   preserveWhitespace: false,
//   shouldDecodeNewlines: true
// })
// console.log(astRes)

const vfile = require('to-vfile')
const unified = require('unified')
const parse = require('rehype-parse')
const stringify = require('rehype-stringify')
const report = require('vfile-reporter')

unified()
  .use(parse, {
    fragment: true,
    emitParseErrors: true,
    duplicateAttribute: false
  })
  .use(require('./transform'))
  .use(stringify, {
    quoteSmart: true,
    closeSelfClosing: true,
    omitOptionalTags: true,
    entities: { useShortestReferences: true }
  })
  .process(vfile({ contents: template.trim() }), function(err, file) {
    console.error(report(err || file))
    // console.log(String(file))
  })
