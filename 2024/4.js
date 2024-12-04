require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')

  const grid = lines.map(line => line.split(''))
  const width = grid[0].length
  const height = grid.length

  function getLetters (x, y, dx = 0, dy = 0, length = 1) {
    if (x < 0 || x >= width || y < 0 || y >= height ||
        x + (length - 1) * dx >= width ||
        x + (length - 1) * dx < 0 ||
        y + (length - 1) * dy >= height ||
        y + (length - 1) * dy < 0
    ) {
      return ''
    }
    const letters = []
    for (let index = 0; index < length; ++index) {
      letters.push(grid[y + index * dy][x + index * dx])
    }
    return letters.join('')
  }

  function getXmasCount (x, y, solutionGrid) {
    let count = 0
    for (let dy = -1; dy < 2; ++dy) {
      for (let dx = -1; dx < 2; ++dx) {
        if ((dx || dy) && getLetters(x, y, dx, dy, 4) === 'XMAS') {
          if (solutionGrid) {
            for (let index = 0; index < 4; ++index) {
              plot(solutionGrid, x + index * dx, y + index * dy, 'XMAS'[index])
            }
          }
          ++count
        }
      }
    }
    return count
  }

  let solution1 = 0
  const solution1Grid = new Array(height).fill(0).map(_ => ''.padStart(width, '.'))
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      if (grid[y][x] === 'X') {
        solution1 += getXmasCount(x, y, solution1Grid)
      }
    }
  }
  if (verbose) {
    console.log(solution1Grid.join('\n'))
    console.log('\n' + ''.padStart(width, '-') + '\n')
  }
  yield solution1

  function getCrossMasCount (x, y, solutionGrid) {
    /*
      M.S M.M S.M S.S
      .A. .A. .A. .A.
      M.S S.S S.M M.M
    */
    let count = 0
    const letters = [
      getLetters(x - 1, y - 1),
      getLetters(x + 1, y - 1),
      getLetters(x - 1, y + 1),
      getLetters(x + 1, y + 1)
    ].join('')
    if (['MSMS', 'MMSS', 'SMSM', 'SSMM'].includes(letters)) {
      ++count
      plot(solutionGrid, x - 1, y - 1, letters[0])
      plot(solutionGrid, x + 1, y - 1, letters[1])
      plot(solutionGrid, x, y, 'A')
      plot(solutionGrid, x - 1, y + 1, letters[2])
      plot(solutionGrid, x + 1, y + 1, letters[3])
    }
    return count
  }

  let solution2 = 0
  const solution2Grid = new Array(height).fill(0).map(_ => ''.padStart(width, '.'))
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      if (grid[y][x] === 'A') {
        solution2 += getCrossMasCount(x, y, solution2Grid)
      }
    }
  }
  if (verbose) {
    console.log(solution2Grid.join('\n'))
  }
  yield solution2
})
