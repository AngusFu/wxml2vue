// [x] 注意针对 template content 的处理
// [x] text 中的插值: keep as it is
// [x] property 插值:
//  * [x] wx:for wx:if => directives
//  * [x] normal properties
// [ ] <template is="{{name}}"></template>
//  * [x] <template name="xxx"></template> 转换
//  * [ ] template 包装
//  * [ ] template 转为 component
// [ ] <import /> and <include />
// [ ] Tagname 修改

const proccess = require('./proccess')
const plugins = require('./plugins')()

module.exports = async function(template, plugin) {
  try {
    return proccess(template, plugin ? plugins.concat(plugin) : plugins)
  } catch (e) {
    console.error(proccess.report(e))
    throw e
  }
}
