import WFRequest from './WFRequest'

let WFRequestInstance = null

/** @module wfConsumation/index */

export default {
  /**
   * Get the instance of WFRequest and call the API
   * @param {Object} request The request module
   * @module wfConsumation/index
   */
  getData (request) {
    if (!WFRequestInstance) {
      WFRequestInstance = new WFRequest(request)
    }
    return new Promise((resolve, reject) => {
      WFRequestInstance.getData().then((instance) => {
        resolve(instance.infos)
      })
    })
  }
}
