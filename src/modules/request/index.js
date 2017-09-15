/* global XMLHttpRequest XDomainRequest */

/** @module request/index */

/**
 * Get an ajax object
 * @return XMLHttpRequest
 */
function getXMLHttpRequest (args) {
  var xhr = null

  if (typeof XDomainRequest !== 'undefined') {
    xhr = new XDomainRequest()
  } else if (typeof XMLHttpRequest !== 'undefined') {
    xhr = new XMLHttpRequest()
    if (typeof args.withCredentials !== 'undefined' && args.withCredentials) {
      xhr.withCredentials = true
    }
  } else {
    console.log('Votre navigateur n\'est pas à jour. Mettez le à jour ou téléchargez un navigateur plus récent.')
  }

  return xhr
}

/**
 * Bind the callbacks of the success and failure events
 * @param {XMLHttpRequest} request The Ajax object
 * @param {function} success The succes callback
 * @param {function} failure The failure callback
 */
function bindOnRequest (request, success, failure) {
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        success(request)
      } else {
        // We reached our target server, but it returned an error
        failure(request)
      }
    }
  }

  request.onerror = function () {
    // There was a connection error of some sort
    failure(request)
  }
}

/**
 * Recursive call to translate the objects in one string
 * @param  {Object} objToFlat Object to translate
 * @param  {String} name The existing key
 * @return {String}
 */
function flatObject (objToFlat, name) {
  let datas = ''
  let iteration = 0
  for (var subKey in objToFlat) {
    if (iteration) {
      datas += '&'
    }
    if (typeof objToFlat[subKey] === 'object') {
      datas += flatObject(objToFlat[subKey], name + '[' + subKey + ']')
    } else {
      datas += name + '[' + subKey + ']=' + encodeURIComponent(objToFlat[subKey])
    }
    ++iteration
  }
  return datas
}

/**
 * Transforms a map of parameters to a query string
 * @param  {Object}  args The payload
 * @param  {Boolean} bypassQuestionMark To know if we add a '?' at the begining
 * @return {String} The query string
 */
function getEncodedURL (args, bypassQuestionMark = false) {
  let datas = ''

  if (typeof args === 'string') {
    return args
  }

  if (typeof args.datas !== 'undefined') {
    let firstLoop = true
    for (var index in args.datas) {
      if (firstLoop) {
        datas += !bypassQuestionMark ? '?' : ''
      } else {
        datas += '&'
      }
      if (typeof args.datas[index] === 'object') {
        datas += flatObject(args.datas[index], index)
      } else {
        datas += index + '=' + encodeURIComponent(args.datas[index])
      }
      firstLoop = false
    }
  }

  return datas
}

/**
 * Assigns the headers to the request
 * @param  {XMLHTTPRequest} request The current request
 * @param  {Object} args The headers to assign
 */
function setHeaders (request, args) {
  if (typeof args.headers !== 'undefined') {
    for (var index in args.headers) {
      request.setRequestHeader(index, args.headers[index])
    }
  }
}

export default {
  /**
   * To call with a GET
   * @param {string} url The url to call
   * @param {Object} args The argument to put in the url
   * @param {Function} success The success callback
   * @param {Function} failure The failure callback
   */
  get (url, args, success, failure) {
    var datas = getEncodedURL(args)
    var request = getXMLHttpRequest(args)
    if (!request) {
      return failure()
    }
    request.open('GET', url + datas, true)

    setHeaders(request, args)
    bindOnRequest(request, success, failure)
    request.send()
    return request
  },
  /**
   * To call with a DELETE
   * @param {string} url The url to call
   * @param {Object} args The argument to put in the url
   * @param {Function} success The success callback
   * @param {Function} failure The failure callback
   */
  delete (url, args, success, failure) {
    var datas = getEncodedURL(args)
    var request = getXMLHttpRequest(args)
    if (!request) {
      return failure()
    }
    request.open('DELETE', url + datas, true)

    setHeaders(request, args)
    bindOnRequest(request, success, failure)
    request.send()
    return request
  },
  /**
   * To call with a POST
   * @param {string} url The url to call
   * @param {Object} args The argument to put in the payload
   * @param {Function} success The success callback
   * @param {Function} failure The failure callback
   */
  post (url, args, success, failure) {
    var request = getXMLHttpRequest(args)
    if (!request) {
      return failure()
    }
    request.open('POST', url, true)

    setHeaders(request, args)
    bindOnRequest(request, success, failure)
    if (args.forceRawDatas) {
      request.send(getEncodedURL(args.datas || '', true))
    } else {
      request.send(JSON.stringify(args.datas || {}))
    }
    return request
  },
  /**
   * To call with a PUT
   * @param {string} url The url to call
   * @param {Object} args The argument to put in the payload
   * @param {Function} success The success callback
   * @param {Function} failure The failure callback
   */
  put (url, args, success, failure) {
    var request = getXMLHttpRequest(args)
    if (!request) {
      return failure()
    }
    request.open('PUT', url, true)

    setHeaders(request, args)
    bindOnRequest(request, success, failure)
    if (args.forceRawDatas) {
      request.send(getEncodedURL(args.datas || '', true))
    } else {
      request.send(JSON.stringify(args.datas || {}))
    }
    return request
  },
  /**
   * To call with a PATCH
   * @param {string} url The url to call
   * @param {Object} args The argument to put in the payload
   * @param {Function} success The success callback
   * @param {Function} failure The failure callback
   */
  patch (url, args, success, failure) {
    var request = getXMLHttpRequest(args)
    if (!request) {
      return failure()
    }
    // The try catch is for some browsers (IE) which don't support PATCH
    try {
      request.open('PATCH', url, true)
    } catch (e) {
      request.open('POST', url, true)
    }

    setHeaders(request, args)
    bindOnRequest(request, success, failure)
    if (args.forceRawDatas) {
      request.send(getEncodedURL(args.datas || '', true))
    } else {
      request.send(JSON.stringify(args.datas || {}))
    }
    return request
  }
}
