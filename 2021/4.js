const { input, lines } = require('../lib')
const numbers = lines[0].split(',').map(Number)

class Grid {
  constructor (numbers) {
    this._rowMarked = [0, 0, 0, 0, 0]
    this._colMarked = [0, 0, 0, 0, 0]
    this._numbers = {}
    this._completed = false
    numbers.forEach((number, index) => {
      const col = index % 5
      const row = (index - col) / 5
      this._numbers[number] = { row, col }
    })
  }

  check (number) {
    const { row, col } = this._numbers[number] ?? {}
    if (row !== undefined && col !== undefined) {
      this._numbers[number].marked = true
      if (++this._rowMarked[row] === 5 ||
        ++this._colMarked[col] === 5) {
        this._completed = true
      }
      return this._completed
    }
  }

  get completed () {
    return this._completed
  }

  sumOfUnmarked () {
    return Object.keys(this._numbers)
      .filter(number => !this._numbers[number].marked)
      .map(Number)
      .reduce((sum, number) => sum + number, 0)
  }

  // Not the fastest way but for debugging
  _at (atRow, atCol) {
    const number = Object.keys(this._numbers)
      .filter(number => {
        const { row, col } = this._numbers[number]
        return row === atRow && col === atCol
      })[0]
    return {
      ...this._numbers[number],
      number
    }
  }

  display () {
    for (let row = 0; row < 5; ++row) {
      const buffer = []
      for (let col = 0; col < 5; ++col) {
        const data = this._at(row, col)
        const number = data.number.toString().padStart(2, ' ')
        if (data.marked) {
          buffer.push(`[${number}]`)
        } else {
          buffer.push(` ${number} `)
        }
      }
      console.log(buffer.join(' '), `| ${this._rowMarked[row]}`)
    }
    console.log('-------------------------+')
    const buffer = []
    for (let col = 0; col < 5; ++col) {
      buffer.push(`  ${this._colMarked[col]}  `)
    }
    console.log(buffer.join(''), '\n')
  }
}

const grids = []
input.replace(/(?: ?\d+\s+\d+\s+\d+\s+\d+\s+\d+(?:\r?\n|$)){5}/g, gridNumbersText => {
  const gridNumbers = gridNumbersText.split(/\s+/).filter(c => !!c).map(Number)
  grids.push(new Grid(gridNumbers))
})

// grids.forEach(grid => grid.display())

numbers.forEach(number => {
  grids
    .forEach((grid, index) => {
      if (grid.completed) {
        return
      }
      if (grid.check(number)) {
        // grid.display()
        console.log(`grid ${index + 1}`, grid.sumOfUnmarked(), '*', number, '=', grid.sumOfUnmarked() * number)
      }
    })
})

// grids.forEach(grid => grid.display())
