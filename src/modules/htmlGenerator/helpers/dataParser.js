/** @module htmlGenerator/helpers/dataParser */

/**
 * Like the normal split but don't split in a function or in a string
 * @param {string} str The string to split
 * @param {string} delimiter The character which will be used to split
 * @return array
 */
function customSplit (str, delimiter) {
  let splitted = []
  let beginning = 0
  let preventSplit = {
    delimiter: '',
    activated: false
  }
  for (let i = 0; i < str.length; ++i) {
    if (preventSplit.activated === true &&
      (
        (str[i] === '"' && preventSplit.delimiter === '"') ||
        (str[i] === "'" && preventSplit.delimiter === "'") ||
        (str[i] === ')' && preventSplit.delimiter === '(')
      )
    ) {
      if (i > 0 && str[i - 1] !== '\\') {
        preventSplit.delimiter = ''
        preventSplit.activated = false
        continue
      }
    }
    if (preventSplit.activated === false && (str[i] === '"' || str[i] === "'" || str[i] === '(')) {
      preventSplit.delimiter = str[i]
      preventSplit.activated = true
      continue
    }
    if (preventSplit.activated === false && str[i] === delimiter) {
      splitted.push(str.substr(beginning, i - beginning))
      beginning = i + 1
    }
  }
  splitted.push(str.substr(beginning, str.length - beginning))
  return splitted
}
/**
 * Get the variable value
 * @param {object} currentData The current state of the data
 * @param {string} key The key to access
 * @return mixed
 */
function getVariableData (currentData, key) {
  if (typeof currentData[key] === 'undefined' || currentData[key] === null) {
    return undefined
  }
  return currentData[key]
}
/**
 * Execute a function and return the result
 * @param {object} currentData The current state of the data
 * @param {string} key The key to access
 * @param {object} datas The original dataset
 * @param {object} aliases The alias dataset
 * @return mixed
 */
function getFunctionData (currentData, key, datas, aliases) {
  let functionParameters = key.match(/([A-Za-z0-9_]+)\(([A-Za-z0-9_. ,'"[\]\\]+)\)/)
  if (functionParameters) {
    let parameters = customSplit(functionParameters[2], ',')
    let toEval = 'currentData[key.substr(0, key.indexOf(\'(\'))]('
    parameters.map((parameter, index) => {
      if (index !== 0) {
        toEval += ', '
      }
      if (parameter.trim().match(/(\d+)|('.*')|(".*")/)) {
        toEval += parameter.trim()
      } else {
        toEval += "'" + getData(datas, parameter.trim(), aliases) + "'"
      }
    })
    return eval(toEval + ')')
  } else {
    console.log('Method with a bad format')
    return undefined
  }
}
/**
 * Retrieve the data by a key, if the key is a sub object, we go deeper
 * @param {object} datas The original dataset
 * @param {string} key The key to access
 * @param {object} aliases The alias dataset
 * @return mixed
 */
function getData (datas, key, aliases) {
  if (typeof key === 'undefined' || typeof datas === 'undefined' || !datas || !key) {
    return undefined
  }

  let currentData = datas
  key = key.replace(/(\[|\])/g, '.').trim()
  let splittedKey = customSplit(key, '.')
  // For the loops
  for (let aliasName in aliases) {
    if (splittedKey[0].startsWith(aliasName)) {
      currentData = aliases[aliasName].value[aliases[aliasName].iteration]
      splittedKey.splice(0, 1)
      break
    }
  }
  for (let i = 0; i < splittedKey.length; ++i) {
    if (splittedKey[i].length === 0) {
      continue
    }
    if (splittedKey[i].includes('(')) {
      return getFunctionData(currentData, splittedKey[i], datas, aliases)
    } else {
      currentData = getVariableData(currentData, splittedKey[i])
    }
  }
  return currentData
}

export default {
  customSplit,
  getVariableData,
  getFunctionData,
  getData
}
