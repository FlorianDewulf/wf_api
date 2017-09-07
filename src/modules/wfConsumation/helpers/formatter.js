import moment from 'moment'
import constants from '../constants'
import languages from '../../../config/languages.json'
import nodes from '../../../config/solNodes.json'

moment.locale('fr')

// Check existence
function exists (value) {
  return (typeof value !== 'undefined' && value)
}

// Check existence or pick the default value
function existsOrDefault (value, defaultValue = null) {
  if (defaultValue === null) {
    return exists(value)
  }
  return exists(value) ? value : defaultValue
}

// Render a reward object
function getReward (itemObject) {
  let itemName = exists(itemObject.ItemType) ? itemObject.ItemType.toLowerCase() : null

  return {
    quantity: itemObject.ItemCount,
    name: existsOrDefault(languages[itemName], { value: 'Objet inconnu' }).value
  }
}

export default {
  formatAlert: (originalAlerts) => {
    return originalAlerts.map((originalAlert, alertIndex) => {
      let faction = existsOrDefault(constants.factions[originalAlert.MissionInfo.faction], 'Faction inconnue')
      let node = existsOrDefault(nodes[originalAlert.MissionInfo.location], { value: 'Emplacement inconnu' }).value
      let mission = existsOrDefault(constants.missions[originalAlert.MissionInfo.missionType], { value: 'Mission inconnue' }).value
      let rewards
      if (exists(originalAlert.MissionInfo.missionReward.countedItems)) {
        rewards = originalAlert.MissionInfo.missionReward.countedItems.map((item, itemIndex) => {
          return getReward(item)
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
  },
  formatInvasion: (originalInvasions) => {
    let filteredInvasions = originalInvasions.filter((originalInvasion) => {
      return originalInvasion.Completed === false
    })

    return filteredInvasions.map((filteredInvasion, alertIndex) => {
      let attackerFaction = existsOrDefault(constants.factions[filteredInvasion.AttackerMissionInfo.faction], 'Faction inconnue')
      let defendersFaction = existsOrDefault(constants.factions[filteredInvasion.DefenderMissionInfo.faction], 'Faction inconnue')
      let node = existsOrDefault(nodes[filteredInvasion.Node], { value: 'Emplacement inconnu' }).value
      let rewardAttacker = []
      if (exists(filteredInvasion.DefenderReward.countedItems)) {
        rewardAttacker = filteredInvasion.DefenderReward.countedItems.map((item) => {
          return getReward(item)
        })
      }
      let rewardDefender = []
      if (exists(filteredInvasion.AttackerReward.countedItems)) {
        rewardDefender = filteredInvasion.AttackerReward.countedItems.map((item) => {
          return getReward(item)
        })
      }

      // negatif = avantage attaquant

      return {
        attackers: {
          faction: attackerFaction,
          reward: rewardAttacker,
          percentage: 0
        },
        defenders: {
          faction: defendersFaction,
          reward: rewardDefender,
          percentage: 0
        },
        location: node
      }
    })
  }
}