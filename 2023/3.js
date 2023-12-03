require('../challenge')(function * ({
  lines,
  verbose
}) {
  // Assuming all lines have the same length
  const width = lines[0].length

  // Build a grid that adds dots 'around' lines to simplify search
  const grid = [
    ''.padStart(width + 2, '.'),
    ...lines.map(line => `.${line}.`),
    ''.padStart(width + 2, '.')
  ]

  if (verbose) {
    console.log(grid.join('\n'))
  }

  function hasSurroundingSymbols ({ grid, y, x, length }) {
    const xFrom = Math.max(x - 1, 0)
    const xTo = xFrom + length + 1
    const chars = grid[y - 1].substring(xFrom, xTo + 1) +
      grid[y][xFrom] +
      grid[y][xTo] +
      grid[y + 1].substring(xFrom, xTo + 1)
    return chars.replace(/[.0-9]/g, '').length > 0
  }

  let sum = 0
  grid.forEach((line, y) => line.replace(/(\d+)/g, (_, digits, x) => {
    const { length } = digits
    const number = parseInt(digits, 10)
    if (hasSurroundingSymbols({ grid, y, x, length })) {
      if (verbose) {
        console.log('✔️', digits)
      }
      sum += number
    } else if (verbose) {
      console.log('✗', digits)
    }
  }))
  yield sum

  // Rewrite the grid to keep only digits & stars
  const filteredGrid = grid.map(line => line.replace(/[^0-9*]/g, '.'))
  // Keep only relevant numbers
  const gearsGrid = filteredGrid.map((line, y) => line.replace(/(\d+)/g, (_, digits, x) => {
    const { length } = digits
    if (hasSurroundingSymbols({ grid: filteredGrid, y, x, length })) {
      return digits
    } else {
      return ''.padStart(length, '.')
    }
  }))

  if (verbose) {
    console.log(gearsGrid.join('\n'))
  }

  const MAX_DIGITS = 3 // as observed
  function listNumbers (x, y) {
    const numbers = []

    /* ..---..
          *
       digits must be at least within --- range
    */
    function extract (line) {
      line.replace(/(\d+)/g, (_, digits, pos) => {
        const { length } = digits
        if (!(pos + length <= 2 || pos > 4)) {
          numbers.push(parseInt(digits, 10))
        }
      })
    }

    const lineBefore = gearsGrid[y - 1].substring(x - MAX_DIGITS, x + MAX_DIGITS + 1)
    const line = gearsGrid[y].substring(x - MAX_DIGITS, x + MAX_DIGITS + 1)
    const lineAfter = gearsGrid[y + 1].substring(x - MAX_DIGITS, x + MAX_DIGITS + 1)
    if (verbose) {
      const fmt = line => line.substring(0, 2) + '[' + line.substring(2, 5) + ']' + line.substring(5)
      console.log('@', x, y, [fmt(lineBefore), fmt(line), fmt(lineAfter)])
    }

    extract(lineBefore)
    extract(line)
    extract(lineAfter)

    return numbers
  }

  let gearsRatio = 0
  gearsGrid.forEach((line, y) => line.replace(/\*/g, (match, x) => {
    const numbers = listNumbers(x, y)
    if (numbers.length > 2) {
      console.error('⁉', numbers)
      process.exit(0)
    } else if (numbers.length > 1) {
      if (verbose) {
        console.log('✔️', numbers)
      }
      gearsRatio += numbers.reduce((total, number) => total * number, 1)
    } else if (verbose) {
      console.log('✗', numbers)
    }
  }))
  yield gearsRatio
})
