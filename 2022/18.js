require('../challenge')(async function * ({
  assert,
  lines
}) {
  const { empty, extend, isInside } = await require('../lib/range')
  const { build: buildLoopControl } = await require('../lib/loop_control')

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

  // store all cubes in a grid, search for pockets of hot air

  const [[minX, maxX], [minY, maxY], [minZ, maxZ]] = ranges

  // Keep room around for the filling step

  const gridRanges = [[minX - 1, maxX + 1], [minY - 1, maxY + 1], [minZ - 1, maxZ + 1]]
  const lx = maxX - minX + 3
  const ly = maxY - minY + 3
  const lz = maxZ - minZ + 3

  const FREE = 0
  const LAVA = 1
  const FILLED = 2

  const grid = new Array(lz).fill(0)
    .map(_ => new Array(ly).fill(0)
      .map(_ => new Array(lx).fill(FREE))
    )

  const translate = ([x, y, z]) => [x - minX + 1, y - minY + 1, z - minZ + 1]
  const isInGrid = coord => gridRanges.every((range, index) => isInside(range, coord[index]))
  const set = (coord, value) => {
    const [tx, ty, tz] = translate(coord)
    grid[tz][ty][tx] = value
  }
  const isFree = coord => {
    const [tx, ty, tz] = translate(coord)
    return grid[tz][ty][tx] === FREE
  }

  cubes.forEach(coord => set(coord, LAVA))

  // 'Fill' the grid

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
    set([x, y, z], FILLED)
    offsets.forEach(([dx, dy, dz]) => {
      const point = [x + dx, y + dy, z + dz]
      if (isInGrid(point) && isFree(point)) {
        points.push(point) // Might already be in the list...
      }
    })
  }

  // Now look for hot air pockets
  const hotAirPockets = []
  for (let z = minZ; z <= maxZ; ++z) {
    for (let y = minY; y <= maxY; ++y) {
      for (let x = minX; x <= maxX; ++x) {
        const point = [x, y, z]
        if (isFree(point)) {
          hotAirPockets.push(point)
        }
      }
    }
  }
  const hotAirSurface = surface(hotAirPockets)
  console.log('Hot air pockets :', hotAirPockets, '\nHot air surface :', hotAirSurface)

  yield exposed - hotAirSurface
})
