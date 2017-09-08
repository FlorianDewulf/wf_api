import request from './modules/request'
import wfConsumation from './modules/wfConsumation'
import htmlGenerator from './modules/htmlGenerator'
import routes from '../config/routes'

export {
  request,
  wfConsumation,
  htmlGenerator
}

function startApplication () {
  // Because of Unit Test
  if (typeof document !== 'undefined') {
    var eventLoad = document.createEvent('Event')
    eventLoad.initEvent('wf-api-ready', true, true)
    eventLoad.data = {
      applications: {
        request,
        wfConsumation,
        htmlGenerator
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
