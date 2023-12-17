require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { build: buildLoopControl } = await require('../lib/loop_control')

  const width = lines[0].length
  const height = lines.length
  if (verbose) {
    console.log('Grid size :', width, 'x', height)
  }

  function next ({ x, y, dir, dist, loss }, cache, { minStraight, maxStraight }) {
    const forward = {
      U: [x, y - 1],
      D: [x, y + 1],
      L: [x - 1, y],
      R: [x + 1, y]
    }
    const turns = {
      U: ['L', 'R'],
      D: ['L', 'R'],
      L: ['U', 'D'],
      R: ['U', 'D']
    }
    const moves = []
    if (dist < maxStraight) {
      const [nextX, nextY] = forward[dir]
      moves.push({ x: nextX, y: nextY, dir, dist: dist + 1 })
    }
    if (dist >= minStraight) {
      turns[dir].forEach(dir => {
        const [nextX, nextY] = forward[dir]
        moves.push({ x: nextX, y: nextY, dir, dist: 1 })
      })
    }
    const baseKey = `@${x},${y}->@`
    return moves
      .filter(({ x, y }) => x >= 0 && x < width && y >= 0 && y < height)
      .filter(({ x, y, dist }) => {
        const key = `${baseKey}${x},${y},${dist}`
        if (cache.has(key)) {
          return false
        }
        cache.add(key)
        return true
      })
      .map(({ x, y, ...pos }) => ({
        x,
        y,
        ...pos,
        loss: loss + Number(lines[y][x])
      }))
  }

  function calculate (initial, settings) {
    let loss = 0
    const loop = buildLoopControl(300 * 1000)
    const queue = [[initial]]
    const cache = new Set()
    while (true) {
      // if (verbose) {
      //   console.log(loss, queue[loss])
      // }
      if (queue[loss]) {
        for (const pos of queue[loss]) {
          if (pos.x === width - 1 && pos.y === height - 1) {
            return loss
          }
          loop.log('Moving from ({x},{y},{dir}), loss: {loss}...', {
            ...initial,
            loss
          })
          next({ loss, ...pos }, cache, settings).forEach(({ loss, ...nextPos }) => {
            queue[loss] ??= []
            queue[loss].push(nextPos)
          })
        }
      }
      ++loss
    }
  }

  yield Math.min(
    calculate({ x: 0, y: 0, dir: 'R', dist: 0 }, { minStraight: 0, maxStraight: 3 }),
    calculate({ x: 0, y: 0, dir: 'D', dist: 0 }, { minStraight: 0, maxStraight: 3 })
  )

  yield Math.min(
    calculate({ x: 0, y: 0, dir: 'R', dist: 0 }, { minStraight: 4, maxStraight: 10 }),
    calculate({ x: 0, y: 0, dir: 'D', dist: 0 }, { minStraight: 4, maxStraight: 10 })
  )
})
