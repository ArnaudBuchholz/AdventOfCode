const { lines } = require('../lib')

class Cave {
  get name () {
    return this._name
  }

  get big () {
    return this._big
  }

  connect (cave) {
    this._connections.push(cave)
    cave._connections.push(this)
  }

  get connections () {
    return this._connections
  }

  constructor (name) {
    this._name = name
    this._big = name.toUpperCase() === name
    this._connections = []
  }
}

const caves = {}
const start = caves.start = new Cave('start')
const end = caves.end = new Cave('end')

lines.forEach(connection => {
  const [cave1, cave2] = connection.split('-')
  if (!caves[cave1]) {
    caves[cave1] = new Cave(cave1)
  }
  if (!caves[cave2]) {
    caves[cave2] = new Cave(cave2)
  }
  caves[cave1].connect(caves[cave2])
})

function visit (position, visited = [], paths = []) {
  if (position === end) {
    visited.push(end)
    paths.push(visited.map(cave => cave.name).join(','))
    return paths
  }
  for (const connected of position.connections) {
    if (connected.big || !visited.includes(connected)) {
      visit(connected, [...visited, position], paths)
    }
  }
  return paths
}

const part1 = visit(start)
console.log('Part 1 :', part1.length, ':', part1)

function visit2 (position, visited = [], visitCounts = { max: 2 }, paths = []) {
  if (position === end) {
    visited.push(end)
    paths.push(visited.map(cave => cave.name).join(','))
    return paths
  }
  for (const connected of position.connections) {
    if (connected === start) {
      continue
    }
    if (connected.big) {
      visit2(connected, [...visited, position], { ...visitCounts }, paths)
    } else {
      const { name } = connected
      let count = visitCounts[name] ?? 0
      let { max } = visitCounts
      if (++count > max) {
        continue
      }
      if (count === 2) {
        max = 1
      }
      visit2(connected, [...visited, position], { ...visitCounts, max, [name]: count }, paths)
    }
  }
  return paths
}

const part2 = visit2(start)
console.log('Part 2 :', part2.length, ':', part2)
