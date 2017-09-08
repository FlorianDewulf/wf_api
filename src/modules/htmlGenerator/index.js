import datasetParser from './datasetParser'

let templates = {}

function mapData (node, datas, recursive = false) {
  let nodeToInsert = node

  if (!recursive) {
    nodeToInsert = node.cloneNode(true)
  }

  nodeToInsert.classList.remove('template')
  datasetParser.recursiveParsing(nodeToInsert, datas)

  return nodeToInsert
}

export default {
  /**
   * Register templates and remove it from the dom to reuse it
   */
  registerTemplates: (registerList) => {
    registerList.map((registerItem) => {
      let nodeTarget = registerItem.node

      // If the target is a string, we get the node
      if (typeof registerItem.node === 'string') {
        nodeTarget = document.querySelector(registerItem.node)
      }
  
      // Check the target node existence
      if (!nodeTarget) {
        console.log('Target doesn\'t exist')
        return
      }

      templates[registerItem.name] = nodeTarget.parentNode.removeChild(nodeTarget)
    })
  },
  /**
   * 
   */
  applyTemplate: (templateName, target, datas) => {
    let nodeTarget = target

    // Check template existence
    if (typeof templates[templateName] === 'undefined') {
      console.log('Template doesn\'t exist')
      return
    }

    // If the target is a string, we get the node
    if (typeof target === 'string') {
      nodeTarget = document.querySelector(target)
    }

    // Check the target node existence
    if (!nodeTarget) {
      console.log('Target doesn\'t exist')
      return
    }

    if (datas && datas.constructor === Array) {
      datas.map((data) => {
        let nodeFilled = mapData(templates[templateName], datas)
        nodeTarget.appendChild(nodeFilled)
      })
    } else {
      let nodeFilled = mapData(templates[templateName], datas)
      nodeTarget.appendChild(nodeFilled)
    }
  }
}