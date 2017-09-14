// Like the normal split but don't split in a function or in a string
function customSplit (string, delimiter) {
  let splitted = []
  let beginning = 0
  let preventSplit = {
    delimiter: '',
    activated: false
  }
  for (let i = 0; i < string.length; ++i) {
    if (preventSplit.activated === true &&
      (
        (string[i] === '"' && preventSplit.delimiter === '"') ||
        (string[i] === "'" && preventSplit.delimiter === "'") ||
        (string[i] === ')' && preventSplit.delimiter === '(')
      )
    ) {
      if (i > 0 && string[i - 1] !== '\\') {
        preventSplit.delimiter = ''
        preventSplit.activated = false
        continue
      }
    }
    if (preventSplit.activated === false && (string[i] === '"' || string[i] === "'" || string[i] === '(')) {
      preventSplit.delimiter = string[i]
      preventSplit.activated = true
      continue
    }
    if (preventSplit.activated === false && string[i] === delimiter) {
      splitted.push(string.substr(beginning, i - beginning))
      beginning = i + 1
    }
  }
  splitted.push(string.substr(beginning, string.length - beginning))
  return splitted
}

// Get the data from a variable
function getVariableData (currentData, key) {
  if (typeof currentData[key] === 'undefined' || currentData[key] === null) {
    return undefined
  }
  return currentData[key]
}

// Execute a function and return the result
function getFunctionData (currentData, key, datas, aliases) {
  let functionParameters = key.match(/([A-Za-z0-9_]+)\(([A-Za-z0-9_. ,'"[\]\\]+)\)/)
  if (functionParameters) {
    let parameters = customSplit(functionParameters[2], ',')
    let toEval = 'currentData[key.substr(0, key.indexOf(\'(\'))]('
    parameters.map((parameter, index) => {
      if (index !== 0) {
        toEval += ', '
      }
      if (parameter.trim().match(/(\d+)|('.*')|(".*")/)) {
        toEval += parameter.trim()
      } else {
        toEval += "'" + getData(datas, parameter.trim(), aliases) + "'"
      }
    })
    return eval(toEval + ')')
  } else {
    console.log('Method with a bad format')
    return undefined
  }
}

// Retrieve the data by a key
// If the key is a sub object, we go deeper
function getData (datas, key, aliases) {
  if (typeof key === 'undefined' || typeof datas === 'undefined' || !datas || !key) {
    return undefined
  }

  let currentData = datas
  key = key.replace(/(\[|\])/g, '.').trim()
  let splittedKey = customSplit(key, '.')
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
    if (splittedKey[i].includes('(')) {
      return getFunctionData(currentData, splittedKey[i], datas, aliases)
    } else {
      currentData = getVariableData(currentData, splittedKey[i])
    }
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
}

// Set text content thanks to blade notation
function parseBlade (node, datas, aliases) {
  // to edit
  let innerHtml = node.innerHTML
  let bladeNotations = innerHtml.match(/\{\{[ \t]*[A-Za-z0-9_.[\](, )'"]+[ \t]*\}\}/g)
  if (bladeNotations) {
    for (let bladeNotation in bladeNotations) {
      let internalValue = bladeNotations[bladeNotation].match(/\{\{[ \t]*([A-Za-z0-9_.[\](, )'"]+)[ \t]*\}\}/)
      console.log(internalValue)
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
    isParsed: false,
    newNode: node
  }
  if (node.getAttribute('hg-loop')) {
    // Get the pattern "xx in xxx"
    let match = node.getAttribute('hg-loop').trim().match(/([A-za-z_]+) in ([A-za-z_.[\]()]+)/)
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
        returnValue.newNode = container

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
  let loop = parseLoop(node, datas, aliases)
  if (!(loop.hasLoop && loop.isParsed)) {
    for (var i = 0; i < node.children.length; i++) {
      recursiveParsing(node.children[i], datas, aliases)
    }
  }
  node = loop.newNode
  console.log(node, !loop.hasLoop || (loop.hasLoop && loop.isParsed))
  if (!loop.hasLoop || (loop.hasLoop && loop.isParsed)) {
    parseBlade(node, datas, aliases)
  }
}

export default {
  parseTxt,
  parseLoop,
  parseBlade,
  recursiveParsing
}
