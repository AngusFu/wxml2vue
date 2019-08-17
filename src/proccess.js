const vfile = require('to-vfile')
const unified = require('unified')
const parse = require('rehype-parse')
const stringify = require('rehype-stringify')
const report = require('vfile-reporter')
const parseEntities = require('parse-entities')

module.exports = function(file, plugins) {
  if (!file) throw new Error('Path or file expected!')

  if (typeof file === 'string') {
    file = vfile({ contents: file })
  }

  vfile.contents = file.contents.trim()

  const preccessor = [
    [
      parse,
      {
        fragment: true,
        emitParseErrors: true,
        duplicateAttribute: false
      }
    ],
    ...(plugins || []),
    [
      stringify,
      {
        quoteSmart: true,
        closeSelfClosing: true,
        omitOptionalTags: true,
        entities: { useShortestReferences: true }
      }
    ]
  ].reduce(
    (preccessor, current) => preccessor.use(...[].concat(current)),
    unified()
  )

  return preccessor.process(file).then(vfile => {
    vfile.contents = parseEntities(vfile.contents)
    return vfile
  })
}

module.exports.report = report
