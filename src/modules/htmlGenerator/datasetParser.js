// Retrieve the data by a key
// If the key is a sub object, we go deeper
function getData(datas, key, aliases) {
  if (typeof key === 'undefined' || typeof datas === 'undefined' || !datas || !key) {
    return undefined
  }

  let currentData = datas
  key = key.replace(/(\[|\])/g, '.')
  let splittedKey = key.split('.')
  // For the loops
  for (let aliasName in aliases) {
    if (splittedKey[0].startsWith(aliasName)) {
      currentData = aliases[aliasName].value[aliases[aliasName].iteration]
      splittedKey.splice(0, 1)
      break
    }
  }
  for (let i = 0; i < splittedKey.length; ++i) {
    if (splittedKey[i].length === 0) {
      continue
    }
    if (typeof currentData[splittedKey[i]] === 'undefined' || currentData[splittedKey[i]] === null) {
      return undefined
    }
    currentData = currentData[splittedKey[i]]
  }
  return currentData
}

// Set text content thanks to data-hg-text
function parseTxt (node, datas, aliases) {
  if (node.getAttribute('hg-text')) {
    let _data = getData(datas, node.getAttribute('hg-text').trim(), aliases)
    if (typeof _data !== 'undefined') {
      node.textContent = _data
      node.removeAttribute('hg-text')
    }
  }
  // to edit
  let innerHtml = node.innerHTML
  let bladeNotations = innerHtml.match(/\{\{[ \t]*[A-Za-z0-9_\.\[\]]+[ \t]*\}\}/g)
  if (bladeNotations) {
    for (let bladeNotation in bladeNotations) {
      let internalValue = bladeNotations[bladeNotation].match(/\{\{[ \t]*([A-Za-z0-9_\.\[\]]+)[ \t]*\}\}/)
      let val = getData(datas, internalValue[1], aliases)
      if (typeof val !== 'undefined') {
        innerHtml = innerHtml.replace(bladeNotations[bladeNotation], val)
      }
    }
    node.innerHTML = innerHtml
  }
}

// Create a container and loop on an array
// TODO : create new attribute or modify this one to get an alias (it allows to use array var in DOM and root var)
function parseLoop (node, datas, aliases) {
  let returnValue = {
    hasLoop: (node.getAttribute('hg-loop') !== null),
    isParsed: false
  }
  if (node.getAttribute('hg-loop')) {
    // Get the pattern "xx in xxx"
    let match = node.getAttribute('hg-loop').trim().match(/([A-za-z_]+) in ([A-za-z_]+)/)
    if (match && match.length === 3) {
      let aliasValue = getData(datas, match[2], aliases)
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

        for (let i = 0; i < aliasValue.length; ++i) {
          aliases[match[1]].iteration = i
          let clone = template.cloneNode(true)
          recursiveParsing(clone, datas, aliases)
          container.appendChild(clone)
        }
      }
    }
  }
  return returnValue
}

// The recursive call to parse the attributes
function recursiveParsing (node, datas, aliases = {}) {
  parseTxt(node, datas, aliases)
  parseTxt(node, datas, aliases)
  let loop = parseLoop(node, datas, aliases)
  if (!(loop.hasLoop && loop.isParsed)) {
    for (var i = 0; i < node.children.length; i++) {
      recursiveParsing(node.children[i], datas, aliases)
    }
  }
}

export default {
  parseTxt,
  parseLoop,
  recursiveParsing
}