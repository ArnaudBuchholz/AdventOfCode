require('../challenge')(async function * ({
  lines
}) {
  const { buildDestMap, getPath } = await require('../lib/path_finding')

  const width = lines[0].length
  const height = lines.length
  let start
  let goal
  const heightYX = lines.map((line, y) => {
    return line.split('').map((symbol, x) => {
      if (symbol === 'S') {
        start = [x, y]
        return 0
      } else if (symbol === 'E') {
        goal = [x, y]
        return 25
      } else {
        return symbol.charCodeAt(0) - 97
      }
    })
  })

  console.log('Start', start)
  console.log('Goal', goal)

  const destMap = buildDestMap(goal, ([nx, ny], [cx, cy]) =>
    nx >= 0 && nx < width && ny >= 0 && ny < height &&
    heightYX[ny][nx] >= heightYX[cy][cx] - 1
  )
  const path = getPath(start, destMap)

  const pathMap = heightYX.map(cols => cols.map(_ => '.'))
  path.slice(1).reduce(([px, py], [nx, ny]) => {
    let char = ''
    if (ny > py) {
      char = 'v'
    } else if (ny < py) {
      char = '^'
    } else if (nx < px) {
      char = '<'
    } else {
      char = '>'
    }
    pathMap[py][px] = char
    return [nx, ny]
  }, start)
  pathMap[goal[1]][goal[0]] = 'E'
  console.log(pathMap.map(cols => cols.join('')).join('\n'))

  yield path.length - 1

  let min = Infinity
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      if (heightYX[y][x] !== 0) {
        continue
      }
      const pathSize = getPath([x, y], destMap).length - 1
      if (pathSize > 0) {
        min = Math.min(pathSize, min)
      }
    }
  }

  yield min
})
