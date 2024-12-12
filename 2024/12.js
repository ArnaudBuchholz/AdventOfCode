require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')
  const { build: buildLoopControl } = await require('../lib/loop_control')

  const width = lines[0].length
  const height = lines.length
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 }
  ]

  const regions = [] // { type: 'A', area: 0, perimeter: 0, sides: 0, cells: ['0,0'...], region: ['...', ...] }

  function identifyRegions () {
    const loop = buildLoopControl(Number.POSITIVE_INFINITY)
    const visited = new Set()
    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        loop.log('Identifying... {x},{y}: {count}', { x, y, count: regions.length })
        if (visited.has(`${x},${y}`)) {
          continue
        }

        const type = lines[y][x]
        const region = new Array(height).fill(0).map(_ => ''.padEnd(width, '.'))
        const cells = [] // `${x},${y}` as it is easier to check if already present
        const toVisit = [`${x},${y}`]

        let area = 0
        while (toVisit.length) {
          const cell = toVisit.shift()
          const [cellX, cellY] = cell.split(',').map(Number)
          loop.log('Identifying... {x},{y}: {count} / {type} {cx},{cy} {cellsCount}', { x, y, count: regions.length, type, cx: cellX, cy: cellY, cellsCount: toVisit.length })
          ++area
          plot(region, cellX, cellY, type)
          visited.add(cell)
          cells.push(cell)
          for (const { dx, dy } of directions) {
            const nx = cellX + dx
            const ny = cellY + dy
            const next = `${nx},${ny}`
            if (!visited.has(next) && nx >= 0 && nx < width && ny >= 0 && ny < height && !toVisit.includes(next) && lines[ny][nx] === type) {
              toVisit.push(next)
            }
          }
        }

        const borderCells = []
        for (const cell of cells) {
          const [x, y] = cell.split(',').map(Number)
          for (const { dx, dy } of directions) {
            const nx = x + dx
            const ny = y + dy
            if (!cells.includes(`${nx},${ny}`)) {
              borderCells.push({ x: nx, y: ny })
            }
          }
        }

        const perimeter = borderCells.length

        const alignedBorders = [] // { direction: 'unknown' | 'horizontal' | 'vertical', start: {x, y}: end: {x,y} }
        while (borderCells.length) {
          const { x, y } = borderCells.shift()
          let aligned = false
          for (const alignedBorder of alignedBorders) {
            const { direction, start, end } = alignedBorder
            if (direction === 'unknown') {
              if (start.y === y && (start.x === x - 1 || start.x === x + 1)) {
                alignedBorder.direction = 'horizontal'
                if (start.x < x) {
                  end.x = x
                } else {
                  start.x = x
                }
                aligned = true
              } else if (start.x === x && (start.y === y - 1 || start.y === y + 1)) {
                alignedBorder.direction = 'vertical'
                if (start.y < y) {
                  end.y = y
                } else {
                  start.y = y
                }
                aligned = true
              }
            } else if (direction === 'horizontal') {
              if (start.y === y) {
                if (x === start.x - 1) {
                  start.x = x
                  aligned = true
                } else if (x === end.x + 1) {
                  end.x = x
                  aligned = true
                }
              }
            } else if (direction === 'vertical') {
              if (start.x === x) {
                if (y === start.y - 1) {
                  start.y = y
                  aligned = true
                } else if (x === end.x + 1) {
                  end.y = y
                  aligned = true
                }
              }
            }
          }
          if (!aligned) {
            alignedBorders.push({ direction: 'unknown', start: { x, y }, end: { x, y }})
          }
        }
        if (verbose) {
          console.log(alignedBorders)
        }
        const sides = 0

        regions.push({ type, area, perimeter, sides, cells, region })
      }
    }
  }

  identifyRegions()
  if (verbose) {
    regions.forEach(({ type, area, perimeter, sides, region }) => console.log(type + ': area=' + area + ' perimeter=' + perimeter + ' sides=' + sides + '\n---\n' + region.join('\n')))
  }

  yield regions.reduce((total, { area, perimeter }) => total + area * perimeter, 0)
  yield regions.reduce((total, { area, sides }) => total + area * sides, 0)
})
