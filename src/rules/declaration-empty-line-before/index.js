import {
  blockString,
  hasEmptyLine,
  isCustomProperty,
  isSingleLineString,
  isStandardSyntaxDeclaration,
  optionsMatches,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "declaration-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before declaration",
  rejected: "Unexpected empty line before declaration",
})

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    }, {
      actual: options,
      possible: {
        except: [
          "first-nested",
          "after-comment",
          "after-declaration",
        ],
        ignore: [
          "after-comment",
          "after-declaration",
          "inside-single-line-block",
        ],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const { prop, parent } = decl

      if (!isStandardSyntaxDeclaration(decl)) { return }
      if (isCustomProperty(prop)) { return }

      // Optionally ignore the node if a comment precedes it
      if (
        optionsMatches(options, "ignore", "after-comment")
        && decl.prev()
        && decl.prev().type === "comment"
      ) {
        return
      }

      // Optionally ignore the node if a declaration precedes it
      if (
        optionsMatches(options, "ignore", "after-declaration")
        && decl.prev()
        && decl.prev().type === "decl"
      ) {
        return
      }

      // Optionally ignore nodes inside single-line blocks
      if (
        optionsMatches(options, "ignore", "inside-single-line-block")
        && isSingleLineString(blockString(parent))
      ) {
        return
      }

      let expectEmptyLineBefore = (expectation === "always") ? true : false

      // Optionally reverse the expectation for the first nested node
      if (optionsMatches(options, "except", "first-nested")
        && decl === parent.first) {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Optionally reverse the expectation if a comment precedes this node
      if (optionsMatches(options, "except", "after-comment")
        && decl.prev()
        && decl.prev().type === "comment") {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Optionally reverse the expectation if a declaration precedes this node
      if (optionsMatches(options, "except", "after-declaration")
        && decl.prev()
        && decl.prev().prop
        && isStandardSyntaxDeclaration(decl.prev())
        && !isCustomProperty(decl.prev().prop)) {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Check for at least one empty line
      const hasEmptyLineBefore = hasEmptyLine(decl.raws["before"])

      // Return if the expectation is met
      if (expectEmptyLineBefore === hasEmptyLineBefore) { return }

      const message = expectEmptyLineBefore ? messages.expected : messages.rejected
      report({
        message,
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
