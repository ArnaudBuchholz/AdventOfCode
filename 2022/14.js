require('../challenge')(async function * ({
  lines
}) {
  // Search the bounds
  let minX = Infinity
  let minY = 0
  let maxX = 0
  let maxY = 0
  lines.forEach(line => {
    line.replace(/(\d+),(\d+)/g, (_, strX, strY) => {
      const x = Number(strX)
      const y = Number(strY)
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    })
  })
  console.log('Bounds :', minX, '-x->', maxX, ',', minY, '-y->', maxY)

  const material = (type) => (grid, x, y) => {
    const layer = grid[y - minY]
    const offset = x - minX
    grid[y - minY] = layer.substring(0, offset) + type + layer.substring(offset + 1)
  }

  const EMPTY = '.'
  const ROCK = '#'
  const rock = material(ROCK)
  const STABLE_SAND = 'o'
  const stableSand = material(STABLE_SAND)

  const inBounds = (x, y) => minX <= x && x <= maxX && minY <= y && y <= maxY

  const get = (grid, x, y) => {
    if (inBounds(x, y)) {
      return grid[y - minY][x - minX]
    }
    return EMPTY
  }

  function getGrid (withFloor) {
    const grid = new Array(maxY + 1).fill(''.padStart(maxX - minX + 1, EMPTY))

    lines.forEach(line => {
      let x
      let y
      line.replace(/(\d+),(\d+)/g, (_, strToX, strToY) => {
        const toX = Number(strToX)
        const toY = Number(strToY)
        if (x === undefined) {
          x = toX
          y = toY
          rock(grid, x, y)
        } else {
          const incX = toX !== x ? Math.sign(toX - x) : 0
          const incY = toY !== y ? Math.sign(toY - y) : 0
          while (toX !== x || toY !== y) {
            rock(grid, x, y)
            x += incX
            y += incY
          }
          rock(grid, x, y)
        }
      })
    })

    if (withFloor) {
      for (let x = minX; x <= maxX; ++x) {
        rock(grid, x, maxY)
      }
    }
    return grid
  }

  const draw = grid => console.log(grid.join('\n'))

  const firstGrid = getGrid(false)
  draw(firstGrid)

  function throwSand (grid) {
    let x = 500
    let y = 0

    while (inBounds(x, y)) {
      const below = get(grid, x, y + 1)
      if (below === EMPTY) {
        ++y
        continue
      } else {
        if (get(grid, x - 1, y + 1) === EMPTY) {
          ++y
          --x
          continue
        }
        if (get(grid, x + 1, y + 1) === EMPTY) {
          ++y
          ++x
          continue
        }
        stableSand(grid, x, y)
        return true
      }
    }
    return false // out of bound
  }

  let firstCount = 0
  do {
    ++firstCount
  } while (throwSand(firstGrid))
  draw(firstGrid)

  yield firstCount - 1

  // Assuming the sand will flow diagonally from 500, 0 to maxY + 2, it mins that maxX = 500 + (maxY + 2) and minX = 500 - (maxY + 2)
  maxY += 2
  // Adding one to be on the safe side ;-)
  maxX = Math.max(maxX, 500 + maxY + 1)
  minX = Math.min(minX, 500 - maxY - 1)

  console.log('Bounds :', minX, '-x->', maxX, ',', minY, '-y->', maxY)
  console.log('Adjusted bounds :', minX, '-x->', maxX, ',', minY, '-y->', maxY)

  const secondGrid = getGrid(true)
  draw(secondGrid)

  let secondCount = 0
  do {
    if (get(secondGrid, 500, 0) === STABLE_SAND) {
      break
    }
    ++secondCount
  } while (throwSand(secondGrid))
  draw(secondGrid)

  yield secondCount
})
