const { getOptions } = require('loader-utils')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const parser = require('@babel/parser')
const types = require('@babel/types')

let commentKeywordsArr = ['@prevent-import']
let parserPlugins = []

const testComment = commentValue => commentKeywordsArr.some(keyword => new RegExp(keyword).test(commentValue.trim()))

const getAst = source => {
  return parser.parse(source, {
    sourceType: 'module',
    plugins: parserPlugins,
  })
}

const enter = path => {
  const node = path.node
  let commentHit = false
  let restLeadingComments, restTrailingComments

  if (node.leadingComments && node.leadingComments.length) {
    const comment = node.leadingComments[node.leadingComments.length - 1]
    if (testComment(comment.value)) {
      node.leadingComments.pop()
      if (node.leadingComments.length) {
        restLeadingComments = node.leadingComments
      }
      commentHit = true
    }
  }

  if (node.trailingComments && node.trailingComments.length) {
    const comment = node.trailingComments[0]
    if (
      node.loc.start.line <= comment.loc.start.line &&
      node.loc.end.line >= comment.loc.start.line &&
      testComment(comment.value)
    ) {
      node.trailingComments.shift()
      if (node.trailingComments.length) {
        restTrailingComments = node.trailingComments
      }
      commentHit = true
    }
  }

  if (commentHit) {
    node.specifiers.forEach((specifier, index, array) => {
      const newNode = types.variableDeclaration('const', [
        types.variableDeclarator(types.identifier(specifier.local.name), types.nullLiteral()),
      ])
      if (index === 0 && restLeadingComments) {
        newNode.leadingComments = restLeadingComments
      }
      if (index === array.length - 1 && restTrailingComments) {
        newNode.trailingComments = restTrailingComments
      }
      path.insertBefore(newNode)
    })
    path.remove()
  }
}

const visitor = {
  ImportDeclaration(path) {
    enter(path)
  },
  ImportSpecifier(path) {
    enter(path)
  },
}

module.exports = function(source) {
  const { commentKeywords, parserPlugins: _parserPlugins } = (this.getOptions ? this.getOptions() : getOptions(this)) || {}
  if (typeof commentKeywords === 'object') {
    if (commentKeywords instanceof Array) {
      commentKeywordsArr = commentKeywords
    } else {
      commentKeywordsArr = Object.keys(commentKeywords).filter(v => commentKeywords[v])
    }
    if (!commentKeywordsArr.length) {
      return source
    }
  }
  if (typeof _parserPlugins === 'object') {
    parserPlugins = _parserPlugins
  }
  const ast = getAst(source)
  traverse(ast, visitor)
  const newSource = generate(ast, {})
  return newSource.code
}