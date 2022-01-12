module.exports = function ({ types: t }) {
  return {
    visitor: {
      Program(path) {
        path.node.body = path.node.body.map((item) => {
          if (
            item.type === 'FunctionDeclaration' ||
            item.type === 'ExportNamedDeclaration' ||
            item.type === 'ExportDefaultDeclaration' ||
            item.type === 'VariableDeclaration'
          ) {
            if (
              item.type === 'ExportNamedDeclaration' &&
              item.declaration.type === 'FunctionDeclaration'
            ) {
              item.declaration.body.body.forEach((itemBlock) => {
                if (
                  itemBlock.type === 'ReturnStatement' &&
                  itemBlock.argument.type === 'JSXElement'
                ) {
                  itemBlock.argument = t.arrowFunctionExpression([], itemBlock.argument)

                  const setup = t.objectMethod(
                    'method',
                    t.identifier('setup'),
                    item.declaration.params,
                    item.declaration.body
                  )

                  const value = t.objectExpression([setup])
                  const declarations = t.variableDeclarator(item.declaration.id, value)

                  item.declaration = t.variableDeclaration('const', [declarations])
                }
              })
            } else if (item.type === 'FunctionDeclaration') {
              item.body.body.forEach((itemBlock) => {
                if (
                  itemBlock.type === 'ReturnStatement' &&
                  itemBlock.argument.type === 'JSXElement'
                ) {
                  itemBlock.argument = t.arrowFunctionExpression([], itemBlock.argument)

                  const setup = t.objectMethod(
                    'method',
                    t.identifier('setup'),
                    item.params,
                    item.body
                  )

                  const value = t.objectExpression([setup])
                  const declarations = t.variableDeclarator(item.id, value)

                  item = t.variableDeclaration('const', [declarations])
                }
              })
            } else if (item.type === 'ExportDefaultDeclaration') {
              item.declaration?.body?.body.forEach((itemBlock) => {
                if (
                  itemBlock.type === 'ReturnStatement' &&
                  itemBlock.argument.type === 'JSXElement'
                ) {
                  itemBlock.argument = t.arrowFunctionExpression([], itemBlock.argument)

                  const setup = t.objectMethod(
                    'method',
                    t.identifier('setup'),
                    item.declaration.params,
                    item.declaration.body
                  )

                  const value = t.objectExpression([setup])

                  item.declaration = value
                }
              })
            } else if (item.type === 'VariableDeclaration') {
              item.declarations.forEach((itemBlock) => {
                if (
                  itemBlock.init.type === 'ArrowFunctionExpression' ||
                  itemBlock.init.type === 'FunctionExpression'
                ) {
                  itemBlock.init.body.body.forEach((childBlock) => {
                    if (
                      childBlock.type === 'ReturnStatement' &&
                      childBlock.argument.type === 'JSXElement'
                    ) {
                      childBlock.argument = t.arrowFunctionExpression([], childBlock.argument)

                      const setup = t.objectProperty(t.identifier('setup'), itemBlock.init)
                      const value = t.objectExpression([setup])

                      itemBlock.init = value
                    }
                  })
                }
              })
            }
          }

          return item
        })
      }
    }
  }
}
