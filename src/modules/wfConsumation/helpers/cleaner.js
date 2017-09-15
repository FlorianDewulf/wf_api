/** @module wfConsumation/cleaner */

export default {
  /**
   * Clean the payload to remove useless keys
   * @param {Object} payload The payload to clean
   * @return {Object}
   */
  cleanPayload: (payload) => {
    delete payload.Events
    delete payload.BuildLabel
    delete payload.Date
    delete payload.LibraryInfo
    delete payload.MobileVersion
    delete payload.PVPActiveTournaments
    delete payload.PVPAlternativeModes
    delete payload.ProjectPct
    delete payload.Time
    delete payload.Version
    delete payload.WorldSeed

    return payload
  }
}
