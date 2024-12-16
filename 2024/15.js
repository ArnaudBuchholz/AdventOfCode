require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')

  const startBoxes = [] // { x, y }
  const walls = [] // { x, y } excluded borders
  let width
  let height
  let moves = ''
  const startPos = {}

  const directions = {
    '<': { dx: -1, dy: 0 },
    v: { dx: 0, dy: 1 },
    '>': { dx: 1, dy: 0 },
    '^': { dx: 0, dy: -1 }
  }

  function parse (widthScale) {
    startBoxes.length = 0
    walls.length = 0
    moves = ''
    const unscaledWidth = lines[0].length - 2
    width = unscaledWidth * widthScale
    let inMap = true
    lines.slice(1).forEach((line, y) => {
      if (inMap) {
        if (line === '#'.padEnd((unscaledWidth + 2), '#')) {
          height = y
          inMap = false
        } else {
          line.split('').slice(1, unscaledWidth + 1).forEach((char, x) => {
            if (char === '@') {
              startPos.x = x * widthScale
              startPos.y = y
            } else if (char === '#') {
              walls.push({ x: x * widthScale, y })
            } else if (char === 'O') {
              startBoxes.push({ x: x * widthScale, y })
            }
          })
        }
      } else {
        moves = moves + line
      }
    })
  }

  function draw (widthScale, boxes, robot) {
    const grid = new Array(height + 2).fill(0).map((_, index) => {
      if (index === 0 || index === height + 1) {
        return ''.padEnd((width) + 2 * widthScale, '#')
      }
      return ''.padEnd(widthScale, '#') + ''.padEnd(width, '.') + ''.padEnd(widthScale, '#')
    })
    plot(grid, robot.x + widthScale, robot.y + 1, '@')
    walls.forEach(({ x, y }) => {
      plot(grid, x + widthScale, y + 1, '#')
      if (widthScale === 2) {
        plot(grid, x + 3, y + 1, '#')
      }
    })
    boxes.forEach(({ x, y }) => {
      if (widthScale === 1) {
        plot(grid, x + 1, y + 1, 'O')
      } else {
        plot(grid, x + 2, y + 1, '[')
        plot(grid, x + 3, y + 1, ']')
      }
    })
    console.log(grid.join('\n'))
  }

  function checkIfWall (widthScale, scanX, scanY) {
    if (scanX === -1 || scanX === width || scanY === -1 || scanY === height) {
      return true
    }
    for (const { x, y } of walls) {
      if (scanY === y && (scanX === x || (widthScale === 2 && scanX === x + 1))) {
        return true
      }
    }
    return false
  }

  /** returns reference on box */
  function checkIfBox (widthScale, boxes, scanX, scanY) {
    let index = 0
    for (const { x, y } of boxes) {
      if (scanY === y && (scanX === x || (widthScale === 2 && scanX === x + 1))) {
        return boxes[index]
      }
      ++index
    }
    return null
  }

  function computeForWidthScale (widthScale) {
    parse(widthScale)
    if (verbose) {
      console.log('Initial state:')
      draw(widthScale, startBoxes, startPos)
      // console.log(moves)
      console.log()
    }

    let iteration = 0
    const pos = { ...startPos }
    const boxes = [...startBoxes]
    for (const move of moves) {
      ++iteration // 504
      const { dx, dy } = directions[move]
      let { x: minScanX, y: scanY } = pos
      let allBoxesToMove = []
      minScanX += dx
      let maxScanX = minScanX
      scanY += dy
      let possible = false
      while (!possible && minScanX >= 0 && minScanX < width && scanY >= 0 && scanY <= height) {
        let x
        for (x = minScanX; x <= maxScanX; ++x) {
          if (checkIfWall(widthScale, x, scanY)) {
            break
          }
        }
        if (x <= maxScanX) {
          break
        }
        const boxesToMove = []
        let boxFound = false
        if (dy === 0) {
          // horizontally
          const box = checkIfBox(widthScale, boxes, minScanX, scanY)
          if (box !== null) {
            if (!allBoxesToMove.includes(box) && !boxesToMove.includes(box)) {
              // May appear twice when scanning horizontally
              boxesToMove.push(box)
            }
            boxFound = true
          }
        } else {
          // vertically
          for (x = minScanX; x <= maxScanX; ++x) {
            const box = checkIfBox(widthScale, boxes, x, scanY)
            if (box !== null) {
              if (!allBoxesToMove.includes(box) && !boxesToMove.includes(box)) {
                // May appear several times when scanning over several Xs
                boxesToMove.push(box)
              }
              boxFound = true
            }
          }
        }
        if (boxFound) {
          if (move === '^' || move === 'v') {
            scanY += dy
            /**
             * TODO: the following is actually incorrect, I should consider only the last moved box, reason :
             *
             *    @ v
             *   []
             *  [][]
             * []  []
             * [][] []   the middle box should not move !
             */
            minScanX = boxesToMove.reduce((min, { x }) => Math.min(min, x), width + 1)
            maxScanX = boxesToMove.reduce((max, { x }) => Math.max(max, x + widthScale - 1), -1)
          } else {
            minScanX += dx
            maxScanX = minScanX
          }
          allBoxesToMove = allBoxesToMove.concat(boxesToMove)
          continue
        }
        possible = true
      }
      if (possible) {
        pos.x += dx
        pos.y += dy
        for (const box of allBoxesToMove) {
          box.x += dx
          box.y += dy
        }
      }
      if (verbose) {
        console.log(`Move ${move}: (iteration #${iteration})`)
        draw(widthScale, boxes, pos)
        console.log()
      }
    }
    return boxes.reduce((total, { x, y }) => total + (y + 1) * 100 + x + widthScale, 0)
  }

  if (verbose) {
    console.log('Part 1 :\n--------')
  }
  yield computeForWidthScale(1)

  if (verbose) {
    console.log('Part 2 :\n--------')
  }
  yield computeForWidthScale(2)
})
