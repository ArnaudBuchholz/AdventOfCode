require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')

  const [, width, height] = lines[0].match(/w=(\d+),h=(\d+)/).map(Number)
  const medianX = Math.floor(width / 2)
  const medianY = Math.floor(height / 2)

  const robots = lines.splice(1).map(line => {
    const [, px, py, vx, vy] = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/).map(Number)
    return { px, py, vx, vy }
  })

  if (verbose) {
    console.log('width=', width, ' height=', height)
    console.log(robots)
  }

  function safetyFactor (positions) {
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
    if (verbose) {
      console.log(quadrants)
    }
    return quadrants.reduce((total, value) => total * value, 1)
  }

  function part1 () {
    const ITERATIONS = 100
    const lastPos = robots.map(({ px, py, vx, vy }) => {
      let x = (px + ITERATIONS * vx) % width
      if (x < 0) {
        x += width
      }
      let y = (py + ITERATIONS * vy) % height
      if (y < 0) {
        y += height
      }
      return { x, y }
    })
    if (verbose) {
      const grid = new Array(height).fill(0).map(_ => ''.padEnd(width, '.'))
      lastPos.forEach(({ x, y }) => {
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
    return safetyFactor(lastPos)
  }
  yield part1()
})
