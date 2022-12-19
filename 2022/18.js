require('../challenge')(async function * ({
  assert,
  lines
}) {
  const { empty, extend } = await require('../lib/range')
  const { build: buildLoopControl } = await require('../lib/loop_control')
  const { build: buildSpace } = await require('../lib/space')

  const hasFaceInCommon = ([x1, y1, z1], [x2, y2, z2]) => {
    return (x1 === x2 && y1 === y2 && (z1 === z2 - 1 || z1 === z2 + 1)) ||
      (x1 === x2 && (y1 === y2 - 1 || y1 === y2 + 1) && z1 === z2) ||
      ((x1 === x2 - 1 || x1 === x2 + 1) && y1 === y2 && z1 === z2)
  }

  assert.ok(hasFaceInCommon([1, 1, 1], [2, 1, 1]))
  assert.ok(!hasFaceInCommon([2, 2, 2], [2, 1, 1]))
  assert.ok(!hasFaceInCommon([1, 1, 1], [2, 1, 2]))

  let ranges = [empty(), empty(), empty()]
  const cubes = lines.map(line => {
    const cube = JSON.parse(`[${line}]`)
    const [rx, ry, rz] = ranges
    const [x, y, z] = cube
    ranges = [extend(rx, x), extend(ry, y), extend(rz, z)]
    return cube
  })
  console.log('Lava :', cubes, '\nRanges :', ranges)

  function surface (cubes) {
    let total = 0
    cubes.forEach((cube, index) => {
      total += 6
      cubes.slice(0, index).forEach(counted => {
        if (hasFaceInCommon(cube, counted)) {
          total -= 2
        }
      })
    })
    return total
  }

  const exposed = surface(cubes)
  yield exposed

  const [[minX, maxX], [minY, maxY], [minZ, maxZ]] = ranges
  const grid = buildSpace([
    [minX - 1, maxX + 1],
    [minY - 1, maxY + 1],
    [minZ - 1, maxZ + 1]
  ])

  const FREE = 0
  const LAVA = 1
  const FILLED = 2

  grid.allocate(FREE)
  cubes.forEach(coord => grid.set(coord, LAVA))

  // grid.fill([minX - 1, minY - 1, minZ - 1], (coord, value) => value === FREE ? FILLED : undefined)

  const points = [[minX - 1, minY - 1, minZ - 1]]
  const offsets = [
    [-1, 0, 0],
    [+1, 0, 0],
    [0, -1, 0],
    [0, +1, 0],
    [0, 0, -1],
    [0, 0, +1]
  ]
  const loop = buildLoopControl()
  while (points.length > 0) {
    loop.log('Filling... {length}', { length: points.length })
    const [x, y, z] = points.pop()
    grid.set([x, y, z], FILLED)
    offsets.forEach(([dx, dy, dz]) => {
      const point = [x + dx, y + dy, z + dz]
      if (grid.isInside(point) && grid.get(point) === FREE) {
        points.push(point) // Might already be in the list...
      }
    })
  }

  // Now look for hot air pockets
  const hotAirPockets = []
  grid.forEach((point, value) => {
    if (value === FREE) {
      hotAirPockets.push(point)
    }
  })
  const hotAirSurface = surface(hotAirPockets)
  console.log('Hot air pockets :', hotAirPockets, '\nHot air surface :', hotAirSurface)

  yield exposed - hotAirSurface
})
