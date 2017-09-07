import request from './modules/request'
import wfConsumation from './modules/wfConsumation'
import routes from '../config/routes'

export {
  request,
  wfConsumation
}

function startApplication () {
  // Because of Unit Test
  if (typeof document !== 'undefined') {
    var eventLoad = document.createEvent('Event')
    eventLoad.initEvent('wf-api-ready', true, true)
    eventLoad.data = {
      applications: {
        request,
        wfConsumation
      },
      routes
    }
    document.dispatchEvent(eventLoad)
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', startApplication)
} else {
  startApplication()
}
