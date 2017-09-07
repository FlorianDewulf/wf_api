import WFRequest from './WFRequest'

let WFRequestInstance = null

export default {
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