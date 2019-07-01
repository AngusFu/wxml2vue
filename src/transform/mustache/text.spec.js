const proccess = require('../../proccess')

it('should keep mustache syntax in text elements as it is', async () => {
  const templates = [
    // 简单绑定
    `<view> {{ message }} </view>`,
    // 算数运算
    `<view> {{a + b}} + {{c}} + d </view>`,
    // 三元运算
    `<view>{{ flag ? 'true' : 'false' }}</view>`,
    // 逻辑判断
    `<view>{{ flag === 'true' }}</view>`,
    // 字符串运算
    `<view>{{"hello" + name}}</view>`,
    // 数据路径运算
    `<view>{{object.key}} {{array[0]}}</view>`
  ]
  for (const s of templates) {
    const vfile = await proccess(s)
    expect(vfile.contents).toBe(s)
  }
})
