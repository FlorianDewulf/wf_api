import dataParser from './dataParser'

/** @module htmlGenerator/helpers/arrayParser */

/**
 * Insert nodes of the hg-loop data and parse it
 * @param {DOMNode} node The current node we are parsing
 * @param {Object} datas The original datas
 * @param {Object} aliases The aliases created during the parsing
 * @param {Function} recursiveParsing The recursive call to parse the generated nodes
 */
function parseLoop (node, datas, aliases, recursiveParsing) {
  let returnValue = {
    hasLoop: (node.getAttribute('hg-loop') !== null),
    isParsed: false,
    newNode: node
  }
  if (node.getAttribute('hg-loop')) {
    // Get the pattern "xx in xxx"
    let match = node.getAttribute('hg-loop').trim().match(/([A-za-z_]+) in ([A-za-z_.[\]()]+)/)
    if (match && match.length === 3) {
      let aliasValue = dataParser.getData(datas, match[2], aliases)
      // Set up the alias to get the data
      if (typeof aliasValue !== 'undefined') {
        let parent = node.parentNode
        aliases[match[1]] = {
          value: aliasValue,
          iteration: 0
        }
        returnValue.isParsed = true

        // create container to keep the position in the DOM
        let container = document.createElement('div')
        let generatedId = Math.round(Math.random() * 10000)
        container.setAttribute('id', generatedId)
        parent.insertBefore(container, node)
        let template = parent.removeChild(node)
        template.removeAttribute('hg-loop')
        returnValue.newNode = container

        for (let i = 0; i < aliasValue.length; ++i) {
          aliases[match[1]].iteration = i
          let clone = template.cloneNode(true)
          recursiveParsing(clone, datas, aliases)
          container.appendChild(clone)
        }

        delete aliases[match[1]]
      }
    }
  }
  return returnValue
}

export default {
  parseLoop
}
