import {
  messages,
  ruleName,
} from ".."
import rules from "../../../rules"
import { testRule } from "../../../testUtils"

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: "a { margin-right: 10px; margin-top: 20px; }",
  }, {
    code: "a { margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }",
  }, {
    code: "a { padding-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }",
  } ],

  reject: [ {
    code: "a { margin-left: 10px; margin-right: 10px; margin-top: 20px; margin-bottom: 30px; }",
    message: messages.rejected("margin-*"),
  }, {
    code: "a { MARGIN-LEFT: 10px; MARGIN-RIGHT: 10px; margin-top: 20px; margin-bottom: 30px; }",
    message: messages.rejected("margin-*"),
  }, {
    code: "a { MARGIN-LEFT: 10px; MARGIN-RIGHT: 10px; MARGIN-TOP: 20px; MARGIN-BOTTOM: 30px; }",
    message: messages.rejected("margin-*"),
  }, {
    code: "a { padding-left: 10px; padding-right: 10px; padding-top: 20px; padding-bottom: 30px; }",
    message: messages.rejected("padding-*"),
  }, {
    code: "a { font-style: italic; font-variant: normal; font-weight: bold; font-size: .8em; font-family: Arial; line-height: 1.2; font-stretch: normal; }",
    message: messages.rejected("font-*"),
  }, {
    code: "a { border-top-width: 7px; border-top-style: double; border-top-color: green; }",
    message: messages.rejected("border-top-*"),
  }, {
    code: "a { -webkit-transition-delay: 0.5s; -webkit-transition-duration: 2s; -webkit-transition-property: top; -webkit-transition-timing-function: ease; }",
    message: messages.rejected("-webkit-transition-*"),
  }, {
    code: "a { border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 1px; }",
    message: messages.rejected("border-*-width"),
  } ],
})

testRule(rule, {
  ruleName,
  config: [ true, { ignoreProperties: [ "/^font-/", "padding-top" ] } ],

  accept: [ {
    code: "a { font-style: italic; font-variant: normal; font-weight: bold; font-size: .8em; font-family: Arial; line-height: 1.2; font-stretch: normal; }",
  }, {
    code: "a { padding-left: 10px; padding-right: 10px; padding-top: 20px; padding-bottom: 30px; }",
  } ],
})
