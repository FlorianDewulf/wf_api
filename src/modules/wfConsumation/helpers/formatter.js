import moment from 'moment'
import constants from '../constants'
import languages from '../../../config/solNodes.json'
import nodes from '../../../config/solNodes.json'

moment.locale('fr')

function exists (value) {
  return (typeof value !== 'undefined' && value)
}

function existsOrDefault (value, defaultValue = null) {
  if (defaultValue === null) {
    return exists(value)
  }
  return exists(value) ? value : defaultValue
}

export default {
  formatAlert: (originalAlerts) => {
    return originalAlerts.map((originalAlert, alertIndex) => {
      let faction = existsOrDefault(constants.factions[originalAlert.MissionInfo.faction], 'Faction inconnue')
      let node = existsOrDefault(nodes[originalAlert.MissionInfo.location], { value: 'Emplacement inconnu' }).value
      let mission = existsOrDefault(constants.missions[originalAlert.MissionInfo.missionType], { value: 'Mission inconnue' }).value
      let rewards
      if (exists(originalAlert.MissionInfo.missionReward.items)) {
        rewards = originalAlert.MissionInfo.missionReward.items.map((item, itemIndex) => {
          return existsOrDefault(nodes[item.toLowerCase()], { value: 'Objet inconnu' }).value
        })
      }

      return {
        faction: faction,
        location: node,
        remaining: moment.duration((moment(originalAlert.Expiry.$date.$numberLong / 1000) - moment().unix()), 's').humanize(),
        minLevel: originalAlert.MissionInfo.minEnemyLevel,
        maxLevel: originalAlert.MissionInfo.maxEnemyLevel,
        missionType: mission,
        reward: {
          credits: originalAlert.MissionInfo.missionReward.credits,
          items: rewards
        }
      }
    })
  }
}