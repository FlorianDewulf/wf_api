export default {
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