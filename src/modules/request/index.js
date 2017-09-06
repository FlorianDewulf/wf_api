/* global XMLHttpRequest XDomainRequest */
/**
 * Récupère un objet ajax
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
 * Bind les callbacks aux evenements de réussite / echec
 * @param {[XMLHttpRequest]}  request L'objet Ajax
 * @param {[function]}        success Le callback de succès
 * @param {[function]}        failure Le callback d'échec
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
 * Fonction récursive et traduit des objets imbriqués en string
 * @param  {[Object]} objToFlat L'objet à traduire
 * @param  {[String]} name      La clef déjà présente de base
 * @return {[String]}           [description]
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
 * Transforme une map de paramètres en 'query string'
 * @param  {[Object]}  args               Le payload
 * @param  {[Boolean]} bypassQuestionMark Pour savoir si on ajoute un '?' au début ou non
 * @return {[String]}                     La 'query string'
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
 * Assigne les headers de la requête
 * @param  {[XMLHTTPRequest]} request La requête actuelle
 * @param  {[Object]}         args    Les headers à assigner
 */
function setHeaders (request, args) {
  if (typeof args.headers !== 'undefined') {
    for (var index in args.headers) {
      request.setRequestHeader(index, args.headers[index])
    }
  }
}

export default {
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
