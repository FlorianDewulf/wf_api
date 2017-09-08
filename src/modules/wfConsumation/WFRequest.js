import cleaner from './helpers/cleaner'
import formatter from './helpers/formatter'

export default class WFRequest {
  constructor (AjaxRequest) {
    this.ajaxRequest = AjaxRequest
    this.content = null
    this.cleanContent = {
      datas: {}
    }
  }

  /**
   * Request the API to get the datas
   */
  getData () {
    return new Promise((resolve, reject) => {
      this.ajaxRequest.get(
        'http://localhost:6819/wfapi',
        '',
        (successResponse) => {
          let response = JSON.parse(successResponse.responseText)
          this.content = cleaner.cleanPayload(response)
          this.concurrentFormatter().then(() => {
            resolve(this)
          })
        },
        (errorResponse) => {
          this.content = null
        }
      )
    })
  }

  /*
   * Transform the data with the formatter.
   * Performed with the concurrency of the promises
   */
  concurrentFormatter () {
    return new Promise ((resolve, reject) => {
      const formats = [
        { action: formatter.formatAlert, data: 'Alerts', target: 'alerts' },
        { action: formatter.formatInvasion, data: 'Invasions', target: 'invasions' },
        { action: formatter.formatVoidFissure, data: 'ActiveMissions', target: 'fissures' },
        { action: formatter.formatSortie, data: 'Sorties', target: 'sorties' },
        { action: formatter.formatBaro, data: 'VoidTraders', target: 'baro' }
      ]
      let promises = []
      
      formats.map((format) => {
        promises.push(new Promise((_promiseResolve) => {
          try {
            _promiseResolve({
              value: format.action(this.content[format.data]),
              target: format.target
            })
          } catch (e) {
            _promiseResolve({
              value: this.content[format.data],
              target: format.target
            })
          }
        }))
      })
      
      Promise.all(promises).then((promiseValues) => {
        promiseValues.map((promiseValue) => {
          this.cleanContent.datas[promiseValue.target] = promiseValue.value
        })
        resolve(this)
      })
    })
  }

  get infos () {
    return this.cleanContent
  }
}