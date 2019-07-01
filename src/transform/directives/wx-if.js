// this file depends on `../mustache/directives.js`
const { omit } = require('lodash')
const visit = require('unist-util-visit')

const keys = ['v-if', 'v-else-if', 'v-else']

module.exports = function() {
  return transformer

  function transformer(tree) {
    visit(tree, 'element', visitor)
  }

  function visitor(node) {
    const { directives } = node

    /* istanbul ignore next */
    if (!directives) {
      return
    }

    node.properties = node.properties || /* istanbul ignore next */ {}

    for (const key of keys) {
      if (key in directives) {
        // TODO
        // boolean attributes are stringified like `v-else=""`
        // SEE https://github.com/syntax-tree/hastscript/issues/5
        if (key === 'v-else' && directives[key] !== '') {
          // SEE https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/
          // <!--wxml-->
          // <view wx:if="{{view == 'WEBVIEW'}}"> WEBVIEW </view>
          // <view wx:elif="{{view == 'APP'}}"> APP </view>
          // <view wx:else="{{view == 'MINA'}}"> MINA </view>
          node.properties['v-else-if'] = directives[key]
        } else {
          node.properties[key] = directives[key]
        }

        node.directives = omit(directives, key)
        break
      }
    }
  }
}
