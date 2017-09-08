import moment from 'moment'
import constants from '../constants'
import languages from '../../../config/languages.json'
import nodes from '../../../config/solNodes.json'

// Check existence
function exists (value) {
  return (value && typeof value !== 'undefined')
}

// Check existence or pick the default value
function existsOrDefault (value, defaultValue = null) {
  if (defaultValue === null) {
    return exists(value)
  }
  return exists(value) ? value : defaultValue
}

// Render a rewards object
function getRewards (initialRewards) {
  let rewards = []
  if (exists(initialRewards.items)) {
    initialRewards.items.map((item) => {
      rewards.push({
        quantity: 1,
        name: existsOrDefault(languages[item.toLowerCase()], { value: item }).value
      })
    })
  }
  if (exists(initialRewards.countedItems)) {
    initialRewards.countedItems.map((itemObject) => {
      let itemName = exists(itemObject.ItemType) ? itemObject.ItemType.toLowerCase() : null

      rewards.push({
        quantity: itemObject.ItemCount,
        name: existsOrDefault(languages[itemName], itemName).value
      })
    })
  }
  return rewards
}

// Get the faction name
function getFaction (code) {
  return existsOrDefault(constants.factions[code], code)
}

// Get the mission type
function getMissionType (code) {
  return existsOrDefault(constants.missions[code], { value: code }).value
}

// Get the node information
function getNode (code) {
  return existsOrDefault(nodes[code], code)
}

export default {
  // Translate the alert object
  formatAlert: (originalAlerts) => {
    return originalAlerts.map((originalAlert, alertIndex) => {
      let faction = getFaction(originalAlert.MissionInfo.faction)
      let node = getNode(originalAlert.MissionInfo.location)
      let mission = getMissionType(originalAlert.MissionInfo.missionType)

      return {
        faction: faction,
        location: exists(node.value) ? node.value : node,
        remaining: moment.duration((moment(originalAlert.Expiry.$date.$numberLong / 1000) - moment().unix()), 's').humanize(true),
        minLevel: originalAlert.MissionInfo.minEnemyLevel,
        maxLevel: originalAlert.MissionInfo.maxEnemyLevel,
        missionType: mission,
        reward: {
          credits: originalAlert.MissionInfo.missionReward.credits,
          items: getRewards(originalAlert.MissionInfo.missionReward)
        }
      }
    })
  },
  // translate the invastion object
  formatInvasion: (originalInvasions) => {
    let filteredInvasions = originalInvasions.filter((originalInvasion) => {
      return originalInvasion.Completed === false
    })

    return filteredInvasions.map((filteredInvasion, alertIndex) => {
      let attackerFaction = getFaction(filteredInvasion.AttackerMissionInfo.faction)
      let defendersFaction = getFaction(filteredInvasion.DefenderMissionInfo.faction)
      let node = getNode(filteredInvasion.Node)
      let percent = (filteredInvasion.Count + filteredInvasion.Goal) / (filteredInvasion.Goal * 2)

      return {
        attackers: {
          faction: attackerFaction,
          reward: getRewards(filteredInvasion.DefenderReward),
          percentage: (1 - percent) * 100
        },
        defenders: {
          faction: defendersFaction,
          reward: getRewards(filteredInvasion.AttackerReward),
          percentage: percent * 100
        },
        location: exists(node.value) ? node.value : node
      }
    })
  },
  // translate the "ActiveMissions" object
  formatVoidFissure: (originalMissions) => {
    return originalMissions.map((originalMission, alertIndex) => {
      let node = getNode(originalMission.Node)
      let level = existsOrDefault(constants.fissures[originalMission.Modifier], originalMission.Modifier)
      let remaining = moment.duration((moment(originalMission.Expiry.$date.$numberLong / 1000) - moment().unix()), 's').humanize(true)

      return { 
        remaining: remaining,
        level: level,
        node: node.value,
        faction: getFaction(node.faction),
        type: getMissionType(node.type)
      }
    })
  },
  // translate the "Sorties" object
  formatSortie: (sortieMissions) => {
    let sorties = sortieMissions.map((sortieMission, alertIndex) => {
      let boss = existsOrDefault(constants.sorties.bosses[sortieMission.Boss], { name: sortieMission.Boss }).name
      let faction = getFaction(existsOrDefault(constants.sorties.bosses[sortieMission.Boss], { faction: '' }).faction)
      let remaining = moment.duration((moment(sortieMission.Expiry.$date.$numberLong / 1000) - moment().unix()), 's').humanize(true)

      let missions = sortieMission.Variants.map((mission) => {
        let node = getNode(mission.node)

        return {
          node: exists(node.value) ? node.value : node,
          type: getMissionType(mission.missionType),
          malus: existsOrDefault(constants.sorties.malus[mission.modifierType], mission.modifierType)
        }
      })

      return { remaining, boss, faction, missions }
    })

    if (sorties.length == 1) {
      return sorties[0]
    } else {
      return sorties
    }
  },
  // translate the "VoidTraders" object
  formatBaro: (voidTraders) => {
    let baro = voidTraders.map((voidTrader, alertIndex) => {
      let node = getNode(voidTrader.Node)
      let remainingComeHumanized = moment.duration((moment(voidTrader.Activation.$date.$numberLong / 1000) - moment().unix()), 's').humanize(true)
      let remainingLeftHumanized = moment.duration((moment(voidTrader.Expiry.$date.$numberLong / 1000) - moment().unix()), 's').humanize(true)

      return {
        node: exists(node.value) ? node.value : node,
        remainingComeHumanized,
        remainingLeftHumanized
      }
    })

    if (baro.length == 1) {
      return baro[0]
    } else {
      return baro
    }
  }
}