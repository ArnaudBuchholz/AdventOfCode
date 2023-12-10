require('../challenge')(function * ({
  lines,
  verbose
}) {
  const width = lines[0].length
  const height = lines.length

  /*
    U: up
    D: down
    L: left
    R: right
  */

  let sx, sy
  lines.every((line, y) => {
    const x = line.indexOf('S')
    if (x !== -1) {
      sy = y
      sx = x
      return false
    }
    return true
  })

  function next (pos, init = false) {
    const { x, y, dir } = pos
    const pipe = lines[y][x]
    const moves = {
      UF: () => [x + 1, y, 'R'],
      LF: () => [x, y + 1, 'D'],
      'L-': () => [x - 1, y, 'L'],
      'R-': () => [x + 1, y, 'R'],
      R7: () => [x, y + 1, 'D'],
      U7: () => [x - 1, y, 'L'],
      'U|': () => [x, y - 1, 'U'],
      'D|': () => [x, y + 1, 'D'],
      RJ: () => [x, y - 1, 'U'],
      DJ: () => [x - 1, y, 'L'],
      DL: () => [x + 1, y, 'R'],
      LL: () => [x, y - 1, 'U']
    }
    const move = moves[dir + pipe]
    if (!move) {
      if (init) {
        return false
      }
      console.error('Failed to compute', pos, pipe)
      if (verbose) {
        plotStep1(p1, '1')
        plotStep1(p2, '2')
        console.log(linesOfStep1.join('\n'))
      }
      throw new Error('Failed')
    }
    const [nextX, nextY, nextDir] = move()
    pos.x = nextX
    pos.y = nextY
    pos.dir = nextDir
    return true
  }

  const linesOfStep1 = [...lines]
  const plotStep1 = ({ x, y }, mark = '*') => {
    const line = linesOfStep1[y]
    linesOfStep1[y] = line.substring(0, x) + mark + line.substring(x + 1)
  }

  const directions = {
    U: { x: 0, y: -1 },
    D: { x: 0, y: +1 },
    L: { x: -1, y: 0 },
    R: { x: 1, y: 0 }
  }
  const p1 = {}
  const p2 = {}
  let p = p1
  if (Object.keys(directions).every(dir => {
    const { x: dx, y: dy } = directions[dir]
    p.x = sx + dx
    p.y = sy + dy
    p.dir = dir
    if (p.x < 0 || p.x >= width || p.y < 0 || p.y >= height) {
      return true // next
    }
    if (next({ ...p }, true)) {
      if (p !== p2) {
        p = p2
        return true
      }
      return false
    }
    return true
  })) {
    throw new Error('Unable to find initial positions')
  }

  const shapeOfS = {
    UD: '|',
    UL: 'J',
    UR: 'L',
    DU: '|',
    DL: '7',
    DR: 'F',
    LR: '-',
    RL: '-'
  }[p1.dir + p2.dir]

  if (verbose) {
    console.log('S found @', sx, sy)
    console.log('Shape of S :', shapeOfS)
    console.log('p1', p1)
    console.log('p2', p2)
  }

  let loops = 1
  while (p1.x !== p2.x || p1.y !== p2.y) {
    plotStep1(p1)
    plotStep1(p2)
    ++loops
    next(p1)
    next(p2)
  }

  if (verbose) {
    plotStep1(p1, 'X')
    console.log(linesOfStep1.join('\n'))
  }

  yield loops

  const linesOfStep2 = linesOfStep1.map((line, y) => {
    return line.replace(/[^SX*]/g, '.').split('').map((point, x) => {
      if (point !== '.') {
        return lines[y][x]
      }
      return '.'
    }).join('')
  })
  linesOfStep2[sy] = linesOfStep2[sy].substring(0, sx) + shapeOfS + linesOfStep2[sy].substring(sx + 1)

  const plotStep2 = ({ x, y }, mark = '*') => {
    const line = linesOfStep2[y]
    linesOfStep2[y] = line.substring(0, x) + mark + line.substring(x + 1)
  }



  if (verbose) {
    console.log('Step 2')
    console.log(linesOfStep2.map(line => line
      .replace(/F|J|7|L/g, match => {
        const pos = 'FJ7L'.indexOf(match)
        return '┌┘┐└'[pos]
      }))
      .join('\n')
    )
  }
})
