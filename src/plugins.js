module.exports = () => [
  require('./transform/mustache/text'),
  require('./transform/mustache/directives'),
  require('./transform/mustache/attrs'),
  require('./transform/mustache/template-is'),

  require('./transform/directives/wx-for'),
  require('./transform/directives/wx-if'),

  require('./transform/template/ref'),
  require('./transform/template/def')
]
