import arrayParser from './helpers/arrayParser'
import textParser from './helpers/textParser'
import conditionnalParser from './helpers/conditionnalParser'

/** @module htmlGenerator/helpers/datasetParser */

/**
 * Recursive call to parse every node and its child
 * @param {DOMNode} node The current node we are parsing
 * @param {Object} datas The original datas
 * @param {Object} aliases The alias datas created during the parsing
 */
function recursiveParsing (node, datas, aliases = {}) {
  conditionnalParser.parse(node, datas, aliases)
  textParser.parseTxt(node, datas, aliases)
  let loop = arrayParser.parseLoop(node, datas, aliases, recursiveParsing)
  if (!(loop.hasLoop && loop.isParsed)) {
    for (var i = 0; i < node.children.length; i++) {
      recursiveParsing(node.children[i], datas, aliases)
    }
  }
  node = loop.newNode
  if (!loop.hasLoop || (loop.hasLoop && loop.isParsed)) {
    textParser.parseBlade(node, datas, aliases)
  }
}

export default {
  recursiveParsing
}
