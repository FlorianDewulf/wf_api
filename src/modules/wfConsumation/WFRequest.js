import cleaner from './helpers/cleaner'
import formatter from './helpers/formatter'

export default class WFRequest {
  constructor (AjaxRequest) {
    this.ajaxRequest = AjaxRequest
    this.content = null
  }

  getData () {
    return new Promise((resolve, reject) => {
      this.ajaxRequest.get(
        'http://localhost:6819/wfapi',
        '',
        (successResponse) => {
          let response = JSON.parse(successResponse.responseText)
          this.content = cleaner.cleanPayload(response)
          // Can be done in parallel with multiple promises
          this.content.Alerts = formatter.formatAlert(this.content.Alerts)
          resolve(this)
        },
        (errorResponse) => {
          this.content = null
        }
      )
    })
  }

  get infos () {
    return this.content
  }
}