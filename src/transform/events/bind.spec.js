const proccess = require('../../proccess')
const bindEventPlugin = require('./bind')

it('should transform bindevent to @event', async () => {
  const array = [
    [
      `<view class="x" bindtap="onTap"></view>`,
      `<view class="x" @tap="onTap"></view>`
    ]
  ]
  for (const [input, expected] of array) {
    const { contents } = await proccess(input, [bindEventPlugin])
    expect(contents).toEqual(expected)
  }
})
