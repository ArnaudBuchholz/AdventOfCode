require('../challenge')(function * ({
  lines,
  verbose
}) {
  lines = lines.map(line => line.split('').map(digit => digit === '.' ? -1 : Number(digit)))
  const width = lines[0].length
  const height = lines.length

  const starts = []
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      if (lines[y][x] === 0) {
        starts.push({ x, y })
      }
    }
  }

  if (verbose) {
    console.log('Starts :', starts)
  }

  function isValidMove (x, y, currentHeight, dx, dy) {
    const nx = x + dx
    const ny = y + dy
    return nx >= 0 && nx < width &&
      ny >= 0 && ny < height &&
      currentHeight + 1 === lines[ny][nx]
  }

  const directions = [
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 }
  ]

  function findTrailheads () {
    const trailheads = {}
    for (const { x: startX, y: startY } of starts) {
      const trailends = {}
      const steps = [{ x: startX, y: startY, h: 0 }]
      while (steps.length) {
        const { x, y, h } = steps.shift()
        for (const { dx, dy } of directions) {
          if (isValidMove(x, y, h, dx, dy)) {
            const newH = lines[y + dy][x + dx]
            if (newH === 9) {
              const id = `${x + dx},${y + dy}`
              if (trailends[id] === undefined) {
                trailends[id] = 1
              } else {
                ++trailends[id]
              }
            } else {
              steps.push({ x: x + dx, y: y + dy, h: newH })
            }
          }
        }
      }
      if (verbose) {
        console.log({ x: startX, y: startY, count: Object.keys(trailheads).length, finals: trailheads })
      }
      trailheads[`${startX},${startY}`] = trailends
    }
    return trailheads
  }

  const trailheads = findTrailheads()

  if (verbose) {
    console.log(trailheads)
  }

  yield Object.values(trailheads).reduce((total, trailends) => total + Object.keys(trailends).length, 0)
  yield Object.values(trailheads).reduce((total, trailends) => total + Object.values(trailends).reduce((total, value) => total + value, 0), 0)
})
