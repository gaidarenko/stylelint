import {
  isEqual,
  isString,
  transform,
} from "lodash"
import {
  optionsHaveIgnoredProperty,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import shorthandData from "../../reference/shorthandData"

export const ruleName = "declaration-block-no-redundant-longhand-properties"

export const messages = ruleMessages(ruleName, {
  rejected: (props) => (
    `Unexpected longhand properties "${props}"`
  ),
})

const customProps = {
  "border-color": "border-*-color",
  "border-style": "border-*-style",
  "border-width": "border-*-width",
  "border": "border-*-*",
}

export default function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreProperties: [isString],
      },
      optional: true,
    })
    if (!validOptions) { return }

    const longhandProperties = transform(shorthandData, (result, values, key) => {
      values.forEach((value) => {
        (result[value] || (result[value] = [])).push(key)
      })
    })

    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      const longhandDeclarations = {}
      // Shallow iteration so nesting doesn't produce
      // false positives
      statement.each(node => {
        if (node.type !== "decl") { return }

        const prop = node.prop.toLowerCase()

        if (optionsHaveIgnoredProperty(options, prop)) { return }

        const shorthandProperties = longhandProperties[prop]

        if (!shorthandProperties) { return }

        shorthandProperties.forEach((shorthandProperty) => {
          (longhandDeclarations[shorthandProperty] || (longhandDeclarations[shorthandProperty] = [])).push(prop)

          if (!isEqual(shorthandData[shorthandProperty].sort(), longhandDeclarations[shorthandProperty].sort())) {
            return
          }

          report({
            ruleName,
            result,
            node,
            message: messages.rejected(
              customProps[shorthandProperty]
                ? customProps[shorthandProperty]
                : `${shorthandProperty}-*`
            ),
          })
        })
      })
    }
  }
}
