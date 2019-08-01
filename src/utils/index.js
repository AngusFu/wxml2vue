const reMustache = /{{\s*.+\s*}}/
exports.hasCurlyBraces = s => reMustache.test(s)
