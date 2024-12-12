require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')
  const { build: buildLoopControl } = await require('../lib/loop_control')

  const width = lines[0].length
  const height = lines.length
  const directions = [
    { dx: 0, dy: -1, label: 'horizontal-up' },
    { dx: 1, dy: 0, label: 'vertical-left' },
    { dx: 0, dy: 1, label: 'horizontal-down' },
    { dx: -1, dy: 0, label: 'vertical-right' }
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
          for (const { dx, dy, label } of directions) {
            const nx = x + dx
            const ny = y + dy
            if (!cells.includes(`${nx},${ny}`)) {
              borderCells.push({ x: nx, y: ny, direction: label })
            }
          }
        }
        const perimeter = borderCells.length

        const individualBorders = [...borderCells]

        const alignedBorders = [] // { direction: 'unique' | 'horizontal' | 'vertical', start: {x, y}: end: {x,y} }
        while (borderCells.length) {
          const { direction: expectedDirection, ...start } = { ...borderCells.shift() }
          const end = { ...start }
          const alignedIndexes = []
          let index = 0

          if (expectedDirection.startsWith('horizontal')) {
            while (index < borderCells.length) {
              if (alignedIndexes.includes(index)) {
                ++index
                continue
              }
              const { x, y, direction } = borderCells[index]
              if (direction !== expectedDirection) {
                ++index
                continue
              }
              if (start.y === y) {
                if (x === start.x - 1) {
                  start.x = x
                  alignedIndexes.push(index)
                  index = -1
                } else if (x === end.x + 1) {
                  end.x = x
                  alignedIndexes.push(index)
                  index = -1
                }
              }
              ++index
            }
          } else if (expectedDirection.startsWith('vertical')) {
            while (index < borderCells.length) {
              if (alignedIndexes.includes(index)) {
                ++index
                continue
              }
              const { x, y, direction } = borderCells[index]
              if (direction !== expectedDirection) {
                ++index
                continue
              }
              if (start.x === x) {
                if (y === start.y - 1) {
                  start.y = y
                  alignedIndexes.push(index)
                  index = -1
                } else if (y === end.y + 1) {
                  end.y = y
                  alignedIndexes.push(index)
                  index = -1
                }
              }
              ++index
            }
          }

          let borderDirection
          if (alignedIndexes.length === 0) {
            borderDirection = expectedDirection + '-unique'
          } else {
            borderDirection = expectedDirection
          }

          let length
          if (borderDirection.startsWith('vertical')) {
            length = end.y - start.y + 1
          } else {
            length = end.x - start.x + 1
          }
          alignedBorders.push({ direction: borderDirection, start, end, length })
          // Ensure the splice is done the higher index first
          alignedIndexes.sort((a, b) => b - a).forEach(index => borderCells.splice(index, 1))
        }
        const sides = alignedBorders.length

        regions.push({ type, area, perimeter, sides, cells, individualBorders, alignedBorders, region })
      }
    }
  }

  identifyRegions()
  if (verbose) {
    regions.forEach(({ type, area, perimeter, sides, cells, individualBorders, alignedBorders }) => {
      console.log(type + ': area=' + area + ' perimeter=' + perimeter + ' sides=' + sides)

      const region = new Array(height + 2).fill(0).map(_ => ''.padEnd(width + 2, ' '))
      cells.forEach(cell => {
        const [x, y] = cell.split(',').map(Number)
        plot(region, x + 1, y + 1, '.')
      })

      individualBorders.forEach(({ x, y, direction }) => {
        let border = region[y + 1][x + 1]
        if (border === ' ') {
          if (direction.startsWith('horizontal')) {
            border = '-'
          } else {
            border = '|'
          }
        } else if (border === '-') {
          if (direction.startsWith('horizontal')) {
            border = '='
          } else {
            border = '+'
          }
        } else if (border === '|') {
          if (direction.startsWith('horizontal')) {
            border = '+'
          } else {
            border = '!'
          }
        } else if (border !== '#') {
          border = '#'
        } else {
          border = '@'
        }
        plot(region, x + 1, y + 1, border)
      })

      console.log(region.join('\n'))
      console.log('Borders checksum :', individualBorders.length, alignedBorders.reduce((total, { length }) => total + length, 0))
      console.log('Borders :', individualBorders.map(({ x, y, direction }) => `(${x},${y},${direction})`).join(' '))

      const uncheckedBorders = [...individualBorders]

      let errors = 0
      alignedBorders
        .sort(({ direction: a }, { direction: b }) => {
          const order = [
            'horizontal-up-unique',
            'horizontal-down-unique',
            'vertical-left-unique',
            'vertical-right-unique',
            'horizontal-up',
            'horizontal-down',
            'vertical-left',
            'vertical-right'
          ]
          if (a === b) {
            return 0
          }
          return order.indexOf(b) - order.indexOf(a)
        })
        .forEach(({ direction, start, end, length }, index) => {
          console.log(index, '(', start.x, ',', start.y, ') ', direction, length)
          if (direction.startsWith('horizontal')) {
            const y = start.y
            for (let x = start.x; x <= end.x; ++x) {
              const pos = uncheckedBorders.findIndex(border => direction.startsWith(border.direction) && border.x === x && border.y === y)
              if (pos === -1) {
                console.log('❌ Problem on ', x, ',', y, direction)
                plot(region, x + 1, y + 1, '?')
                ++errors
              }
              uncheckedBorders.splice(pos, 1)
            }
          } else if (direction.startsWith('vertical')) {
            const x = start.x
            for (let y = start.y; y <= end.y; ++y) {
              const pos = uncheckedBorders.findIndex(border => direction.startsWith(border.direction) && border.x === x && border.y === y)
              if (pos === -1) {
                console.log('❌ Problem on ', x, ',', y, direction)
                plot(region, x + 1, y + 1, '?')
                ++errors
              }
              uncheckedBorders.splice(pos, 1)
            }
          } else {
            const pos = uncheckedBorders.findIndex(border => border.x === start.x && border.y === start.y)
            if (pos === -1) {
              console.log('❌ Problem on ', start.x, ',', start.y, 'unique')
              plot(region, start.x + 1, start.y + 1, '?')
              ++errors
            }
            uncheckedBorders.splice(pos, 1)
          }
        })
      if (uncheckedBorders.length) {
        console.log('❌ Remaining unchecked borders: ', individualBorders.length, uncheckedBorders.length, uncheckedBorders)
        ++errors
      }
      if (errors) {
        console.log(region.join('\n'))
      }
      console.log('\n')
    })
  }

  yield regions.reduce((total, { area, perimeter }) => total + area * perimeter, 0)
  yield regions.reduce((total, { area, sides }) => total + area * sides, 0)
})
