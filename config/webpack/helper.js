module.exports = {
  /**
   * Retourne true si le module JS est situé dans le dossier node_modules
   * @param  {object} module
   * @return {boolean}
   */
  isExternal: function (module) {
    var userRequest = module.userRequest
    if (typeof userRequest !== 'string') {
      return false
    }
    return userRequest.indexOf('node_modules') >= 0
  }
}
