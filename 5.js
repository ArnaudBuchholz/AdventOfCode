const input = require('./input')

const grid = []

function reset () {
  grid.length = 0
  grid.width = 0
  grid.height = 0
}

function set (x, y) {
  if (!grid[y]) {
    grid.height = Math.max(grid.height, y + 1)
    grid[y] = []
  }
  grid.width = Math.max(grid.width, x + 1)
  if (!grid[y][x]) {
    grid[y][x] = 1
  } else {
    ++grid[y][x]
  }
}

// function display () {
//   console.log(grid.width, 'x', grid.height)
//   for (let y = 0; y < grid.height; ++y) {
//     const line = grid[y] || []
//     const buffer = []
//     for (let x = 0; x < grid.width; ++x) {
//       buffer.push(line[x] || '.')
//     }
//     console.log(buffer.join(''))
//   }
// }

function overlap () {
  let result = 0
  for (let y = 0; y < grid.height; ++y) {
    const line = grid[y]
    if (!line) {
      continue
    }
    for (let x = 0; x < grid.width; ++x) {
      if (line[x] && line[x] > 1) {
        ++result
      }
    }
  }
  return result
}

function draw (includeDiagonals) {
  input
    .split('\n')
    .filter(line => !!line)
    .forEach(line => {
      const match = line.match(/(\d+),(\d+) -> (\d+),(\d+)/).slice(1)
      const [x0, y0, x1, y1] = match.map(n => parseInt(n, 10))
      const ysign = Math.sign(y1 - y0) || 1
      const xsign = Math.sign(x1 - x0) || 1
      console.log(x0, y0, '->', x1, y1, '(', xsign, ',', ysign, ')')
      if (x0 === x1) {
        for (let y = y0; ysign * y <= ysign * y1; y += ysign) {
          set(x0, y)
        }
      } else if (y0 === y1) {
        for (let x = x0; xsign * x <= xsign * x1; x += xsign) {
          set(x, y1)
        }
      } else if (includeDiagonals) {
        let x = x0
        let y = y0
        while (xsign * x <= xsign * x1) {
          set(x, y)
          x += xsign
          y += ysign
        }
      }
    })
}

reset()
draw(false)
// display()
console.log('Part 1 :', overlap())

reset()
draw(true)
// display()
console.log('Part 2 :', overlap())
