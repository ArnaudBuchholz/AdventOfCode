require('../challenge')(function * ({
  lines,
  verbose
}) {
  const [xmin, xmax, ymin, ymax] = lines[0]
    .match(/x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/)
    .slice(1).map(Number)

  console.log('Target : x=', xmin, '..', xmax, ', y=', ymin, '..', ymax)

  function solve (name, min, max) {
    const solutions = []
    let initialSpeed
    let minSpeed
    if (name === 'x') {
      initialSpeed = xmax
      minSpeed = 0
    } else {
      initialSpeed = Math.max(Math.abs(min), Math.abs(max))
      minSpeed = Math.min(min, max) - 1
    }
    while (initialSpeed > minSpeed) {
      let speed = initialSpeed
      let c = 0 // coordinate
      while (speed > minSpeed) {
        c += speed
        --speed
        if ((min <= c) && (c <= max)) {
          if (!solutions.includes(initialSpeed)) {
            solutions.push(initialSpeed)
          }
        }
      }
      --initialSpeed
    }
    return solutions
  }

  const solutionsX = solve('x', xmin, xmax)
  console.log('Solutions count for x :', solutionsX.length)
  if (verbose) {
    console.log(solutionsX.sort((a, b) => a - b))
  }
  const solutionsY = solve('y', ymin, ymax)
  console.log('Solutions count for y :', solutionsY.length)
  if (verbose) {
    console.log(solutionsY.sort((a, b) => a - b))
  }

  let maxYSpeed = solutionsY.sort((a, b) => b - a)[0]
  console.log('Max y speed :', maxYSpeed)

  let highestY = 0
  while (maxYSpeed > 0) {
    highestY += maxYSpeed--
  }
  yield highestY

  function sort ([vx1, vy1], [vx2, vy2]) {
    if (vx1 === vx2) {
      return vy1 - vy2
    }
    return vx1 - vx2
  }

  function xCoord (xSpeed, t) {
    let x = 0
    while (t-- > 0) {
      x += Math.max(xSpeed--, 0)
    }
    return x
  }

  const solutions = []
  solutionsY.forEach(vy => {
    let ySpeed = vy
    let y = 0
    let ty = 0
    while (y >= ymin) {
      if ((ymin <= y) && (y <= ymax)) {
        solutionsX.forEach(vx => {
          const x = xCoord(vx, ty)
          if ((xmin <= x) && (x <= xmax)) {
            if (!solutions.some(([cx, cy]) => cx === vx && cy === vy)) {
              solutions.push([vx, vy])
            }
            if (verbose) {
              console.log('[', vx, ',', vy, '] -> (', x, ',', y, ')')
            }
          }
        })
      }
      y += ySpeed--
      ++ty
    }
  })

  yield solutions.length
  if (verbose) {
    console.dir(solutions.sort(sort), { maxArrayLength: null })
  }
})
