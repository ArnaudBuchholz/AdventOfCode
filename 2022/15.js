require('../challenge')(async function * ({
  isSample,
  lines
}) {
  const buildLoopControl = await require('../lib/loop_control')

  let minX = Infinity
  let maxX = 0
  let minY = Infinity
  let maxY = 0

  const dist = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1)

  const sensors = lines.map(line => {
    const match = line.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/)
    const [, sx, sy, bx, by] = match.map(Number)
    const d = dist(sx, sy, bx, by)
    minX = Math.min(minX, sx, bx)
    maxX = Math.max(maxX, sx, bx)
    minY = Math.min(minY, sy, by)
    maxY = Math.max(maxY, sy, by)
    return {
      sx,
      sy,
      bx,
      by,
      d
    }
  })

  const maxSensorDistance = sensors.reduce((total, { d }) => Math.max(total, d), 0)

  console.log('Bounds :', minX, '-x->', maxX, ',', minY, '-y->', maxY)
  console.log('Max sensor distance :', maxSensorDistance)
  console.log(sensors)

  const solution1 = y => {
    let noBeacon = 0
    for (let x = minX - maxSensorDistance; x <= maxX + maxSensorDistance; ++x) {
      if (sensors.some(({ bx, by }) => {
        return x === bx && y === by
      })) {
        continue // Already a beacon
      }
      if (sensors.some(({ sx, sy, d }) => {
        return dist(sx, sy, x, y) <= d
      })) {
        ++noBeacon // Covered by a sensor
      }
    }
    return noBeacon
  }

  if (isSample) {
    yield solution1(10)
  } else {
    yield solution1(2000000)
  }

  const solution2 = (maxCoord) => {
    const loop = buildLoopControl()
    for (let y = 0; y <= maxCoord; ++y) {
      for (let x = 0; x <= maxCoord; ++x) {
        loop.log('Searching... {percent}%', {
          percent: Math.floor(100 * y / maxCoord)
        })
        const sensor = sensors.find(({ sx, sy, d }) => {
          return dist(sx, sy, x, y) <= d
        })
        if (!sensor) {
          return x * 4000000 + y
        }
        /* To speed up search, skip the area covered by the sensor

          ....S....
          .X..|....
          x < sx => skip = 2 * dist(sx, y, x, y)

          .S.........d
          ..........d.
          ....X....d..
          x > sx => skip = d - dist(sx, sy, x, y)
        */
        const { sx, sy, d } = sensor
        if (x < sx) {
          const skip = 2 * dist(sx, y, x, y)
          x += skip
        } else {
          const skip = d - dist(sx, sy, x, y)
          x += skip
        }
      }
    }
  }

  if (isSample) {
    yield solution2(20)
  } else {
    yield solution2(4000000)
  }
})
