const bingo = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`
// const bing = require('./input')(4)

const CONTROL = 5

const toNumber = n => parseInt(n, 10)
const numbers = bingo.split(`\n`)[0].split(',').map(toNumber)
const grids = []
bingo.replace(/(?: ?\d+\s+\d+\s+\d+\s+\d+\s+\d+(?:\n|$)){5}/g, gridNumbersText => {
  const gridNumbers = gridNumbersText.split(/\s+/).filter(c => !!c).map(toNumber)
  const grid = [[], [], [], [], []]
  gridNumbers.forEach((number, index) => {
    grid[Math.floor(index / 5)][index % 5] = number
  })
  grid.push([])
  for (let index = 0; index < 5; ++index) {
    grid[index].push({ sum: 0, ticked: 0 })
    grid[CONTROL].push({ sum: 0, ticked: 0 })
  }
  grids.push(grid)
})

function showGrid (grid) {
  for (let row = 0; row < 5; ++row) {
    const buffer = []
    for (let col = 0; col < 5; ++col) {
      buffer.push(grid[row][col].toString().padStart(5, ' '))
    }
    console.log(buffer.join(' '), grid[row][CONTROL].sum, grid[row][CONTROL].ticked)
  }
}

grids.forEach(showGrid)

function found (control, number) {
  control.sum += number
  if (++control.ticked === 5) {
    return control.sum * number
  }
}

function set (grid, number) {
  for (row = 0; row < 5; ++row) {
    for (col = 0; col < 5; ++col) {
      if (grid[row][col] === number) {
        grid[row][col] = 'X'
        const result = found(grid[row][CONTROL], number) || found(grid[CONTROL][col], number)
        if (result) {
          return result
        }
      }
    }
  }
}

let result
numbers.every(number => {
  console.log(number)
  grids.every(grid => {
    result = set(grid, number)
    return !result
  })
  return !result
})

console.log(grids, result)
