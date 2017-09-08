// Retrieve the data by a key
// If the key is a sub object, we go deeper
function getData(datas, key) {
  if (typeof key === 'undefined' || typeof datas === 'undefined' || !datas || !key) {
    return undefined
  }

  let currentData = datas
  let splittedKey = key.split('.')
  for (let i = 0; i < splittedKey.length; ++i) {
    if (typeof currentData[splittedKey[i]] === 'undefined' || !currentData[splittedKey[i]]) {
      return undefined
    }
    currentData = currentData[splittedKey[i]]
  }
  return currentData
}

// Set text content thanks to data-hg-text
function parseTxt (node, datas) {
  if (node.getAttribute('hg-text') && typeof getData(datas, node.getAttribute('hg-text')) !== 'undefined') {
    node.textContent = getData(datas, node.getAttribute('hg-text'))
    node.removeAttribute('hg-text')
  }
}

// Create a container and loop on an array
// TODO : create new attribute or modify this one to get an alias (it allows to use array var in DOM and root var)
function parseLoop (node, datas) {
  let returnValue = {
    hasLoop: (node.getAttribute('hg-loop') !== null),
    isParsed: false
  }
  if (node.getAttribute('hg-loop') && typeof getData(datas, node.getAttribute('hg-loop')) !== 'undefined') {
    returnValue.isParsed = true
    let parent = node.parentNode

    // create container to keep the position in the DOM
    let container = document.createElement('div')
    let generatedId = Math.round(Math.random() * 10000)
    container.setAttribute('id', generatedId)
    parent.insertBefore(container, node)
    let template = parent.removeChild(node)
    let valuesIterated = getData(datas, node.getAttribute('hg-loop'))
    template.removeAttribute('hg-loop')

    for (let i = 0; i < valuesIterated.length; ++i) {
      let clone = template.cloneNode(true)
      recursiveParsing(clone, valuesIterated[i])
      container.appendChild(clone)
    }
  }
  return returnValue
}

// The recursive call to parse the attributes
function recursiveParsing (node, datas) {
  parseTxt(node, datas)
  let loop = parseLoop(node, datas)
  if (!(loop.hasLoop && loop.isParsed)) {
    for (var i = 0; i < node.children.length; i++) {
      recursiveParsing(node.children[i], datas, true)
    }
  }
}

export default {
  parseTxt,
  parseLoop,
  recursiveParsing
}