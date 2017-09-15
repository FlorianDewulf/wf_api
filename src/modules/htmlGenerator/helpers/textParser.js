import dataParser from './dataParser'

/** @module htmlGenerator/helpers/textParser */

/**
 * Insert text of the hg-text data
 * @param {DOMNode} node The current node we are parsing
 * @param {Object} datas The original datas
 * @param {Object} aliases The aliases created during the parsing
 */
function parseTxt (node, datas, aliases) {
  if (node.getAttribute('hg-text')) {
    let _data = dataParser.getData(datas, node.getAttribute('hg-text').trim(), aliases)
    if (typeof _data !== 'undefined') {
      node.textContent = _data
      node.removeAttribute('hg-text')
    }
  }
}
/**
 * Translate a blade notation to text
 * @param {DOMNode} node The current node we are parsing
 * @param {Object} datas The original datas
 * @param {Object} aliases The aliases created during the parsing
 */
function parseBlade (node, datas, aliases) {
  let innerHtml = node.innerHTML
  let bladeNotations = innerHtml.match(/\{\{[ \t]*[A-Za-z0-9_.[\](, )'"]+[ \t]*\}\}/g)
  if (bladeNotations) {
    for (let bladeNotation in bladeNotations) {
      let internalValue = bladeNotations[bladeNotation].match(/\{\{[ \t]*([A-Za-z0-9_.[\](, )'"]+)[ \t]*\}\}/)
      let val = dataParser.getData(datas, internalValue[1], aliases)
      if (typeof val !== 'undefined') {
        innerHtml = innerHtml.replace(bladeNotations[bladeNotation], val)
      }
    }
    node.innerHTML = innerHtml
  }
}

export default {
  parseTxt,
  parseBlade
}
