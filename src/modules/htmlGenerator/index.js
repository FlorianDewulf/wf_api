import datasetParser from './datasetParser'

let templates = {}

/** @module htmlGenerator/index */

/**
 * Map data to a template
 * @param {Object} request The request module
 * @param {string} urls The url of the template
 */
function mapData (node, datas) {
  let nodeToInsert = node.cloneNode(true)

  nodeToInsert.classList.remove('template')
  datasetParser.recursiveParsing(nodeToInsert, datas)

  return nodeToInsert
}

/**
 * Get a template using AJAX.
 * @param {Object} request The request module
 * @param {string} urls The url of the template
 */
function loadTemplate (request, url) {
  return new Promise((resolve, reject) => {
    request.get(url, {}, (result) => {
      resolve(result.responseText)
    })
  })
}

export default {
  /**
   * Load templates through a list of urls. Concurrency is used to increase the performance.
   * @param {Object} request The request module
   * @param {Array} urls The list of the urls
   * @param {Array} templateContainer The selector or the node of the template container
   */
  loadExternalTemplates: (request, urls, templateContainer) => {
    let promises = []
    let nodeTarget = templateContainer
    let error = false

    // If the templateContainer is a string, we get the node
    if (typeof templateContainer === 'string') {
      nodeTarget = document.querySelector(templateContainer)
    }

    // Check the target node existence
    if (!nodeTarget) {
      console.log('Target doesn\'t exist')
      error = true
    }

    return new Promise((resolve, reject) => {
      if (error) {
        resolve()
        return
      }
      if (typeof urls === 'string') {
        promises.push(loadTemplate(request, urls))
      } else {
        for (let url of urls) {
          promises.push(loadTemplate(request, url))
        }
      }
      Promise.all(promises).then((datas) => {
        for (let index in datas) {
          nodeTarget.innerHTML += datas[index]
        }
        resolve()
      })
    })
  },
  /**
   * Register templates and remove it from the dom to reuse it (with the method 'applyTemplate')
   * @param {Array} registerList The list of the template to register
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
   * Use a template name to find in the template list the one register with this name.
   * Bind the datas to the template and insert it in a new node.
   * @param {string} templateName The name of the template
   * @param {string|DOMNode} target The selector or the node of the target
   * @param {Object} datas The data send to the template
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
