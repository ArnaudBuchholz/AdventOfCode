require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')
  const { build: buildLoopControl } = await require('../lib/loop_control')

  /** ordered clockwise */
  const directions = [ 
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }
  ]

  function solveMaze () {
    const valid = new Set()
    const steps = [{ x: 1, y: lines.length - 2, path: new Set() }]
    const visited = new Set()
    const inSteps = new Set()
    inSteps.add(`${1},${lines.length - 2}`)
    const loop = buildLoopControl(Number.POSITIVE_INFINITY)
    const addToValid = path => {
      for (const key of path.keys()) {
        valid.add(key)
      }
    }
    while (steps.length) {
      loop.log('Part 1 steps={steps}', { steps: steps.length })
      const { x, y, path } = steps.shift()
      const key = `${x},${y}`
      inSteps.delete(key)
      visited.add(key)
      for (const { dx, dy } of directions) {
        const nx = x + dx
        const ny = y + dy
        const next = lines[ny][nx]
        if (next === '#') {
          continue // wall
        }
        const nkey = `${nx},${ny}`
        if (next === 'E') {
          addToValid(path)
          continue
        }
        if (valid.has(nkey)) {
          addToValid(path)
          continue
        }
        // Visited does not mean we took a decision about it
        if (inSteps.has(nkey) || visited.has(nkey)) {
          continue // loop
        }
        inSteps.add(nkey)
        const newPath = new Set([...path])
        newPath.add(nkey)
        const step = {
          x: nx,
          y: ny,
          path: newPath
        }
        steps.unshift(step)
      }
    }
    if (verbose) {
      console.log('Iterations :', loop.logCount)
      const solutions = [...lines]
      for (const key of valid.keys()) {
        const [x, y] = key.split(',').map(Number)
        plot(solutions, x, y, 'O')
      }
      console.log(solutions.join('\n'))
    }
    return finalScore
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
