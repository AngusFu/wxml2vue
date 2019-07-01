const proccess = require('../../proccess')
const wxDirectivesPlugin = require('./directives')
const { select, selectAll } = require('unist-util-select')

it('should attach directives info onto nodes: wx:for-*', done => {
  const template = `
<view wx:for="{{array}}"  wx:for-index="idx" wx:for-item="it" wx:key="id">
  {{idx}} {{it}}
</view>
`
  proccess(template, [
    wxDirectivesPlugin,
    () => {
      return tree => {
        const node = select('element[tagName=view]', tree)
        expect(node.directives).toEqual({
          for: 'array',
          'for-index': 'idx',
          'for-item': 'it',
          key: 'id'
        })
        expect(node.properties).toEqual({})
        done()
      }
    }
  ])
})

it('should attach directives info onto nodes: wx:if-*', done => {
  const template = `
<view wx:if="{{length > 5}}"> 1 </view>
<view wx:elif="{{length > 2}}"> 2 </view>
<view wx:else> 3 </view>
`
  proccess(template, [
    wxDirectivesPlugin,
    () => {
      return tree => {
        const nodes = selectAll('element[tagName=view]', tree)
        expect(nodes[0].directives).toEqual({ 'v-if': 'length > 5' })
        expect(nodes[1].directives).toEqual({ 'v-else-if': 'length > 2' })
        expect(nodes[2].directives).toEqual({ 'v-else': '' })
        done()
      }
    }
  ])
})

it('should set defaults for `wx:for-item` and `wx:for-index`', done => {
  const template = `
<view wx:for="{{array}}">
  {{index}} {{item}}
</view>
`
  proccess(template, [
    wxDirectivesPlugin,
    () => {
      return tree => {
        const node = select('element[tagName=view]', tree)
        expect(node.directives).toEqual({
          for: 'array',
          'for-index': 'index',
          'for-item': 'item'
        })
        done()
      }
    }
  ])
})

it('shoudl treat extra spaces as string', done => {
  const template = `
<view wx:for="{{array}}  ">
  {{index}} {{item}}
</view>
`
  proccess(template, [
    wxDirectivesPlugin,
    () => {
      return tree => {
        const node = select('element[tagName=view]', tree)
        expect(node.directives).toEqual({
          for: '`${array}  `',
          'for-index': 'index',
          'for-item': 'item'
        })
        done()
      }
    }
  ])
})
