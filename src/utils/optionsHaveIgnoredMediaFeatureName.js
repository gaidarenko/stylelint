import matchesStringOrRegExp from "./matchesStringOrRegExp"

/**
 * Check if an options object contains a user-defined string or regex that
 * matches the passed in Node.
 *
 * @param {object} options
 * @param {Node} postcss node
 * @return {boolean} If `true`, a match was found
 */
export default function optionsHaveIgnoredAtRule(options, mediaFeatureName) {
  return !!(
    options &&
    options.ignoreMediaFeatureNames &&
    matchesStringOrRegExp(mediaFeatureName.toLowerCase(), options.ignoreMediaFeatureNames)
  )
}
