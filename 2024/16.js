require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')
  const { build: buildLoopControl } = await require('../lib/loop_control')

  const map = lines
  const start = { x: 1, y: lines.length - 2 }
  const end = { x: lines[0].length - 1, y: 1 }

  /** ordered clockwise */
  const directions = [ 
    { dx: 0, dy: 1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: 0 }
  ]

  function part1() {
    const steps = [{ ...start, direction: 1 /* EAST */, score: 0, visited: new Set() }]
    const loop = buildLoopControl(Number.POSITIVE_INFINITY)
    let finalScore = Number.POSITIVE_INFINITY
    while (steps.length) {
      loop.log('Part 1 steps={steps} finalScore={finalScore}', { steps: steps.length, finalScore })
      const { x, y, direction, score, visited } = steps.shift()
      if (lines[y][x] === 'E') {
        if (score < finalScore) {
          finalScore = score
          console.log('Solution : ', score, ' steps=', visited.size)
        }
      }
      visited.add(`${x},${y}`)
      const check = (newDirection) => {
        const { dx, dy } = directions[newDirection]
        const nx = x + dx
        const ny = y + dy
        if (map[ny][nx] === '#') {
          return // wall
        }
        if (visited.has(`${nx},${ny}`)) {
          return // loop
        }
        let newScore = score + 1
        if (newDirection !== direction) {
          newScore += 1000
        }
        if (newScore >= finalScore) {
          return // too high
        }
        const step = {
          x: nx,
          y: ny,
          direction: newDirection,
          score: newScore,
          visited: new Set([...visited])
        }
        steps.unshift(step)
      }
      check((direction + 1) % directions.length)
      check(direction - 1 < 0 ? direction - 1 + directions.length : direction - 1)
      check(direction)
    }
    return finalScore
  }

  if (verbose) {
    console.log('Part 1 :\n--------')
  }
  yield part1() // < 321992

  if (verbose) {
    console.log('Part 2 :\n--------')
  }
})
