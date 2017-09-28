import dataParser from './dataParser'

/** @module htmlGenerator/helpers/conditionnalParser */

/**
 * Check the visibility of the node
 * @param {DOMNode} node The current node we are parsing
 * @param {Object} datas The original datas
 * @param {Object} aliases The aliases created during the parsing
 */
function parse (node, datas, aliases) {
  parseIf(node, datas, aliases)
  parseShow(node, datas, aliases)
}

/**
 * Delete the node only if the condition is false
 * @param {DOMNode} node The current node we are parsing
 * @param {Object} datas The original datas
 * @param {Object} aliases The aliases created during the parsing
 */
function parseIf (node, datas, aliases) {
  if (node.getAttribute('hg-if')) {
    let _data = dataParser.getData(datas, node.getAttribute('hg-if').trim(), aliases)
    if (typeof _data !== 'undefined') {
      if (!_data) {
        node.parentElement.removeChild(node)
      }
      node.removeAttribute('hg-if')
    }
  }
}

/**
 * Hide the node only if the condition is false
 * @param {DOMNode} node The current node we are parsing
 * @param {Object} datas The original datas
 * @param {Object} aliases The aliases created during the parsing
 */
function parseShow (node, datas, aliases) {
  if (node.getAttribute('hg-show')) {
    let _data = dataParser.getData(datas, node.getAttribute('hg-show').trim(), aliases)
    if (typeof _data !== 'undefined') {
      if (!_data) {
        node.style.display = 'none'
      }
      node.removeAttribute('hg-show')
    }
  }
}

export default {
  parse,
  parseIf,
  parseShow
}
