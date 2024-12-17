require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')
  const { build: buildLoopControl } = await require('../lib/loop_control')

  /** ordered clockwise */
  const directions = [ 
    { from: 'v', dx: 0, dy: -1 },
    { from: '<', dx: 1, dy: 0 },
    { from: '^', dx: 0, dy: 1 },
    { from: '>', dx: -1, dy: 0,  }
  ]

  function solveMaze () {
    const steps = [{ x: lines[0].length - 2, y: 1 }]
    const visited = new Set()
    const loop = buildLoopControl(Number.POSITIVE_INFINITY)
    const solutions = [...lines]
    while (steps.length) {
      loop.log('solveMaze steps={steps}', { steps: steps.length })
      const { x, y } = steps.shift()
      for (const { dx, dy, from } of directions) {
        const nx = x + dx
        const ny = y + dy
        const next = lines[ny][nx]
        const key = `${nx},${ny}`
        if (visited.has(key)) {
          continue
        }
        visited.add(key)
        if (next === '#') {
          continue // wall
        }
        if (next !== 'S' && next !== 'E') {
          plot(solutions, nx, ny, from)
          const step = {
            x: nx,
            y: ny,
            from
          }
          steps.push(step)
        }
      }
    }
    if (verbose) {
      console.log('Iterations :', loop.logCount)
      console.log(solutions.join('\n'))
    }
  }

  // function part1() {
  //   const steps = [{ x: 1, y: lines.length - 2, direction: 1 /* EAST */, score: 0, visited: new Set() }]
  //   const loop = buildLoopControl(Number.POSITIVE_INFINITY)
  //   let finalScore = Number.POSITIVE_INFINITY
  //   while (steps.length) {
  //     loop.log('Part 1 steps={steps} finalScore={finalScore}', { steps: steps.length, finalScore })
  //     const { x, y, direction, score, visited } = steps.shift()
  //     if (lines[y][x] === 'E') {
  //       if (score < finalScore) {
  //         finalScore = score
  //         console.log('Solution : ', score, ' steps=', visited.size)
  //       }
  //     }
  //     visited.add(`${x},${y}`)
  //     const check = (newDirection) => {
  //       const { dx, dy } = directions[newDirection]
  //       const nx = x + dx
  //       const ny = y + dy
  //       if (lines[ny][nx] === '#') {
  //         return // wall
  //       }
  //       if (visited.has(`${nx},${ny}`)) {
  //         return // loop
  //       }
  //       let newScore = score + 1
  //       if (newDirection !== direction) {
  //         newScore += 1000
  //       }
  //       if (newScore >= finalScore) {
  //         return // too high
  //       }
  //       const step = {
  //         x: nx,
  //         y: ny,
  //         direction: newDirection,
  //         score: newScore,
  //         visited: new Set([...visited])
  //       }
  //       steps.unshift(step)
  //     }
  //     check((direction + 1) % directions.length)
  //     check(direction - 1 < 0 ? direction - 1 + directions.length : direction - 1)
  //     check(direction)
  //   }
  //   if (verbose) {
  //     console.log('Iterations :', loop.logCount)
  //   }
  //   return finalScore
  // }

  if (verbose) {
    console.log('Part 1 :\n--------')
  }
  solveMaze()

  // yield part1() // < 321992

  if (verbose) {
    console.log('Part 2 :\n--------')
  }
})
