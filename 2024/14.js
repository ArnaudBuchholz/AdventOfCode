require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')
  const { build: buildLoopControl } = await require('../lib/loop_control')

  const [, width, height] = lines[0].match(/w=(\d+),h=(\d+)/).map(Number)
  const medianX = Math.floor(width / 2)
  const medianY = Math.floor(height / 2)

  const robots = lines.splice(1).map(line => {
    const [, x, y, vx, vy] = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/).map(Number)
    return { x, y, vx, vy }
  })

  if (verbose) {
    console.log('width=', width, ' height=', height)
    console.log(robots)
  }

  function computeQuadrants (positions) {
    const quadrants = [0, 0, 0, 0]
    for (const { x, y } of positions) {
      let quadrantIndex = 0
      if (x === medianX || y === medianY) {
        continue
      }
      if (x > medianX) {
        quadrantIndex += 1
      }
      if (y > medianY) {
        quadrantIndex += 2
      }
      quadrants[quadrantIndex] += 1
    }
    // if (verbose) {
    //   console.log(quadrants)
    // }
    return quadrants
  }

  function safetyFactor (positions) {
    const quadrants = computeQuadrants(positions)
    return quadrants.reduce((total, value) => total * value, 1)
  }

  function iterate (positions, count) {
    return robots.map(({ vx, vy }, index) => {
      let { x, y } = positions[index]
      x = (x + count * vx) % width
      if (x < 0) {
        x += width
      }
      y = (y + count * vy) % height
      if (y < 0) {
        y += height
      }
      return { x, y }
    })
  }

  function show (positions) {
    const grid = new Array(height).fill(0).map(_ => ''.padEnd(width, '.'))
    positions.forEach(({ x, y }) => {
      const current = grid[y][x]
      if (current === '.') {
        plot(grid, x, y, 1)
      } else {
        plot(grid, x, y, Number(current) + 1)
      }
    })
    for (let y = 0; y < height; ++y) {
      const line = grid[y]
      grid[y] = line.substring(0, medianX) + '|' + line[medianX] + '|' + line.substring(medianX + 1)
    }
    grid.splice(medianY, 0, '-'.padEnd(width + 2, '-'))
    grid.splice(medianY + 2, 0, '-'.padEnd(width + 2, '-'))
    console.log(grid.join('\n'))
  }

  function part1 () {
    const lastPos = iterate(robots, 100)
    if (verbose) {
      show(lastPos)
    }
    return safetyFactor(lastPos)
  }
  yield part1()

  function part2 () {
    const loop = buildLoopControl(Number.POSITIVE_INFINITY)
    let positions = robots
    let iterations = 0
    while (iterations < width * height) {
      ++iterations
      loop.log('Iterating... {iterations}', { iterations })
      positions = iterate(positions, 1)
      console.log('Iteration: ', iterations)
      show(positions)
    }
  }

  // Ugly but works but visually check the result
  part2()
  yield 'check the console log and find the Xmas tree'
})
