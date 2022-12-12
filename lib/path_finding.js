const encode = v => v.join(',')

module.exports = {
  // https://www.redblobgames.com/pathfinding/a-star/introduction.html#breadth-first-search

  buildDestMap (target, checkNeighbor) {
    const map = new Map()
    map.set(encode(target), 0)
    const toVisit = [target]
    while (toVisit.length) {
      const current = toVisit.shift()
      const [x, y] = current
      const neighbors = [
        [x, y + 1],
        [x, y - 1],
        [x - 1, y],
        [x + 1, y]
      ]
      neighbors
        .filter(neighbor => !map.has(encode(neighbor)))
        .filter(neighbor => checkNeighbor(neighbor, current))
        .forEach(neighbor => {
          map.set(encode(neighbor), current)
          toVisit.push(neighbor)
        })
    }
    map.delete(encode(target))
    return map
  },

  getPath (current, map) {
    const path = []
    while (current) {
      path.push(current)
      current = map.get(encode(current))
    }
    return path
  }
}
