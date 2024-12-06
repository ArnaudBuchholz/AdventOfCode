require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')

  const height = lines.length
  const width = lines[0].length
  const startY = lines.findIndex(line => line.includes('^'))
  const startX = lines[startY].indexOf('^')
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]

  if (verbose) {
    console.log('Start: [', startX, ',', startY, ']')
  }

  const part1Positions = []

  function part1 () {
    const grid = [...lines]
    let x = startX
    let y = startY
    let direction = 0
    while (x >= 0 && x < width && y >= 0 && y < height) {
      if (grid[y][x] !== 'X') {
        plot(grid, x, y, 'X')
        part1Positions.push([x, y])
      }
      const [dx, dy] = directions[direction]
      const nextX = x + dx
      const nextY = y + dy
      if ((lines[nextY] ?? [])[nextX] === '#') {
        // rotate 90
        direction = (direction + 1) % directions.length
        continue
      }
      x = nextX
      y = nextY
    }

    if (verbose) {
      console.log(grid.join('\n'))
    }
  }

  part1()
  yield part1Positions.length

  /**
   * Part 2 : need to find positions of obstacles that creates loops
   * Problem 1: where to put obstacles ? Only on the know path (reduces the number of possibilities)
   * Problem 2: detect loop ? If the guard comes back on an already visited position in the SAME direction
   */

  function detectLoop ([obstacleX, obstacleY]) {
    const visited = new Set()
    let x = startX
    let y = startY
    let direction = 0
    while (x >= 0 && x < width && y >= 0 && y < height) {
      const position = `${x},${y},${direction}`
      if (visited.has(position)) {
        return true // loop detected
      }
      visited.add(position)
      let nextX
      let nextY
      while (true) {
        const [dx, dy] = directions[direction]
        nextX = x + dx
        nextY = y + dy
        if ((lines[nextY] ?? [])[nextX] === '#' ||
          (nextX === obstacleX && nextY === obstacleY)
        ) {
          // rotate 90
          direction = (direction + 1) % directions.length
        } else {
          break
        }
      }

      x = nextX
      y = nextY
    }

    return false
  }

  yield part1Positions.filter(coordinates => detectLoop(coordinates)).length
})
