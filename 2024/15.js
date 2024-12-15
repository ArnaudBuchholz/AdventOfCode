require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')
  const { build: buildLoopControl } = await require('../lib/loop_control')

  const startBoxes = [] // { x, y }
  const walls = [] // { x, y } excluded borders
  const width = lines[0].length - 2
  let height
  let moves = ''
  const startPos = {}

  const directions = {
    '<': { dx: -1, dy: 0 },
    v: { dx: 0, dy: 1 },
    '>': { dx: 1, dy: 0 },
    '^': { dx: 0, dy: -1 }
  }

  let inMap = true
  lines.slice(1).forEach((line, y) => {
    if (inMap) {
      line.split('').slice(1, width + 1).forEach((char, x) => {
        if (char === '@') {
          startPos.x = x
          startPos.y = y
        } else if (char === '#') {
          walls.push({ x, y })
        } else if (char === 'O') {
          startBoxes.push({ x, y })
        }
      })
      if (line === '#'.padEnd(width + 2, '#')) {
        height = y
        inMap = false
      }
    } else {
      moves = moves + line
    }
  })

  function draw (boxes, robot) {
    const grid = new Array(height + 2).fill(0).map((_, index) => {
      if (index === 0 || index === height + 1) {
        return ''.padEnd(width + 2, '#')
      }
      return '#' + ''.padEnd(width, '.') + '#'
    })
    plot(grid, robot.x + 1, robot.y + 1, '@')
    walls.forEach(({ x, y }) => {
      plot(grid, x + 1, y + 1, '#')
    })
    boxes.forEach(({ x, y }) => {
      plot(grid, x + 1, y + 1, 'O')
    })
    console.log(grid.join('\n'))
  }

  if (verbose) {
    console.log('Initial state:')
    draw(startBoxes, startPos)
    console.log(moves)
    console.log()
  }

  function checkIfWall (scanX, scanY) {
    if (scanX === -1 || scanX === width || scanY === -1 || scanY === height) {
      return true
    }
    for (const { x, y } of walls) {
      if (scanX === x && scanY === y) {
        return true
      }
    }
    return false
  }

  /** returns reference on box */
  function checkIfBox (boxes, scanX, scanY) {
    let index = 0
    for (const { x, y } of boxes) {
      if (scanX === x && scanY === y) {
        return boxes[index]
      }
      ++index
    }
    return null
  }

  function part1 () {
    const pos = { ...startPos }
    const boxes = [...startBoxes]
    for (const move of moves) {
      const { dx, dy } = directions[move]
      let { x: scanX, y: scanY } = pos
      const boxesToMove = []
      scanX += dx
      scanY += dy
      let possible = false
      while (!possible && scanX >= 0 && scanX < width && scanY >= 0 && scanY <= height) {
        if (checkIfWall(scanX, scanY)) {
          break
        }
        const box = checkIfBox(boxes, scanX, scanY)
        if (box !== null) {
          boxesToMove.push(box)
          scanX += dx
          scanY += dy
          continue
        }
        possible = true
      }
      if (possible) {
        pos.x += dx
        pos.y += dy
        for (const box of boxesToMove) {
          box.x += dx
          box.y += dy
        }
      }
      if (verbose) {
        console.log(`Move ${move}:`)
        draw(boxes, pos)
        console.log()
      }
    }
    return boxes.reduce((total, { x, y }) => total + (y + 1) * 100 + x + 1, 0)
  }

  yield part1()
})
