const { lines, int } = require('../lib')
const verbose = process.argv.includes('-verbose')
const grid = []

function count () {
  let count = 0
  for (let y = 0; y < grid.length; ++y) {
    const row = grid[y] ?? []
    const line = []
    for (let x = 0; x < row.length; ++x) {
      if (!row[x]) {
        line[x] = '.'
      } else {
        line[x] = '#'
        ++count
      }
    }
    if (verbose) {
      console.log(line.join(''))
    }
  }
  return count
}

if (verbose) {
  console.log('Initial')
  count()
}

lines
  .forEach(line => {
    const foldingInstructions = /fold along (x|y)=(\d+)/.exec(line)
    if (foldingInstructions) {
      const position = int(foldingInstructions[2])
      if (foldingInstructions[1] === 'x') {
        grid.forEach(row => {
          row.forEach((flag, x) => {
            if (x > position) {
              row[2 * position - x] = flag
            }
          })
          row.length = position
        })
      } else {
        for (let y = position + 1; y < grid.length; ++y) {
          let target = grid[2 * position - y]
          if (!target) {
            target = []
            grid[2 * position - y] = target
          }
          const source = grid[y] ?? []
          source.forEach((flag, index) => {
            target[index] = flag
          })
        }
        grid.length = position
      }
      console.log('Fold on', foldingInstructions[1], ':', position, '=', count())
    } else {
      const [x, y] = line.split(',').map(int)
      if (!grid[y]) {
        grid[y] = []
      }
      grid[y][x] = '#'
    }
  })

count()
if (!verbose) {
  console.log('Use -verbose to see the result')
}
