const Utils = {
  getIn: function (obj, keyArray, notSetValue, assumeLayerHierarchy) {
    if (obj == null) return notSetValue != null ? notSetValue : null
    if (keyArray == null) return notSetValue != null ? notSetValue : null
    if (typeof keyArray === 'string') keyArray = keyArray.split('.')
    let object = Object.assign({}, obj)
    for (let i = 0; i < keyArray.length; i++) {
      if (object && Object.hasOwn(object, keyArray[i])) { object = object[keyArray[i]] } else if (
        assumeLayerHierarchy &&
        object &&
        Utils.objectArrayIndexOfKeyWithValue(object, 'name', keyArray[i]) >= 0
      ) {
        object =
          object[
            Utils.objectArrayIndexOfKeyWithValue(object, 'name', keyArray[i])
          ]
      } else return notSetValue != null ? notSetValue : null
    }
    return object
  },
  objectArrayIndexOfKeyWithValue: function (objectArray, key, value) {
    let index = -1
    for (const i in objectArray) {
      if (objectArray[i]) {
        if (
          Object.hasOwn(objectArray[i], key) &&
          objectArray[i][key] === value
        ) {
          index = i
          break
        }
      }
    }
    return index
  },
  setIn: function (obj, keyArray, value, splice, assumeLayerHierarchy) {
    if (keyArray == null || keyArray.length === 0) return false
    if (typeof keyArray === 'string') keyArray = keyArray.split('.')
    let object = obj
    for (let i = 0; i < keyArray.length - 1; i++) {
      if (Object.hasOwn(object, keyArray[i])) object = object[keyArray[i]]
      else if (
        assumeLayerHierarchy &&
        Utils.objectArrayIndexOfKeyWithValue(object, 'name', keyArray[i]) >= 0
      ) {
        object =
          object[
            Utils.objectArrayIndexOfKeyWithValue(object, 'name', keyArray[i])
          ]
      } else return false
    }
    const finalKey = keyArray[keyArray.length - 1]

    if (splice && !isNaN(finalKey) && typeof object.splice === 'function') { object.splice(parseInt(finalKey), 0, value) } else object[keyArray[keyArray.length - 1]] = value
    return true
  },
  traverseLayers: function (layers, onLayer) {
    let removedUUIDs = []
    depthTraversal(layers, 0, [])
    function depthTraversal (node, depth, path) {
      for (let i = 0; i < node.length; i++) {
        const ret = onLayer(node[i], path, i)
        if (ret === 'remove') {
          const removed = node.splice(i, 1)
          if (removed.length > 0) {
            // Find and store the UUIDs of the sublayers of the removed layer
            const removedSubLayerUUIDs = Utils.findSubLayerUUIDs(removed)
            removedUUIDs = removedUUIDs.concat(removedSubLayerUUIDs)
          }
          i--
        } else if (
          // Add other feature information while we're at it
          node[i] &&
          node[i].sublayers != null &&
          node[i].sublayers.length > 0
        ) {
          depthTraversal(
            node[i].sublayers,
            depth + 1,
            `${path.length > 0 ? path + '.' : ''}${node[i].name}`
          )
        }
      }
    }

    // Returns array of removed layer UUIDs, including all removed sublayer UUIDs
    return removedUUIDs
  },
  findSubLayerUUIDs: function (layers) {
    const UUIDs = []
    Utils.traverseLayers(layers, (layer) => {
      UUIDs.push({ name: layer.name, uuid: layer.uuid })
    })
    return UUIDs
  },
  // From https://javascript.plainenglish.io/4-ways-to-compare-objects-in-javascript-97fe9b2a949c
  isEqual (obj1, obj2, isSimple) {
    if (isSimple) {
      return JSON.stringify(obj1) === JSON.stringify(obj2)
    } else {
      const props1 = Object.getOwnPropertyNames(obj1)
      const props2 = Object.getOwnPropertyNames(obj2)
      if (props1.length !== props2.length) {
        return false
      }
      for (let i = 0; i < props1.length; i++) {
        const prop = props1[i]
        const bothAreObjects =
          typeof obj1[prop] === 'object' && typeof obj2[prop] === 'object'
        if (
          (!bothAreObjects && obj1[prop] !== obj2[prop]) ||
          (bothAreObjects && !Utils.isEqual(obj1[prop], obj2[prop]))
        ) {
          return false
        }
      }
      return true
    }
  }
}

module.exports = Utils
