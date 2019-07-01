const proccess = require('../../proccess')
const wxForPlugin = require('./wx-for')

it('should parse simple wx:for', async () => {
  const template = `
<view wx:for="{{array}}">
  {{index}} {{item}}
</view>
`
  const vfile = await proccess(template, [wxForPlugin])
  expect(vfile.contents).toBe(template)
})
