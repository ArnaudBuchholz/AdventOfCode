require('../challenge')(async function * ({
  input,
  verbose
}) {
  const patterns = input.trim()
    .split('\n')
    .map(line => line.trim())
    .reduce((array, line) => {
      if (!line) {
        array.push([])
      } else {
        array.at(-1).push(line)
      }
      return array
    }, [[]])

  const column = (pattern, x) => pattern.reduce((cols, line) => [...cols, line[x]], []).join('')

  yield patterns.reduce((total, pattern) => {
    if (verbose) {
      console.log('\n' + pattern.join('\n'))
    }
    const width = pattern[0].length
    const height = pattern.length

    let horizontal = -1
    for (let x = 0; x < width - 1; ++x) {
      const max = Math.min(x + 1, width - x - 1)
      let i
      for (i = 0; i < max; ++i) {
        const left = column(pattern, x - i)
        const right = column(pattern, x + 1 + i)
        if (left !== right) {
          break
        }
      }
      if (i === max) {
        horizontal = x + 1
        if (verbose) {
          console.log('horizontal', horizontal)
        }
        break
      }
    }

    let vertical = -1
    for (let y = 0; y < height - 1; ++y) {
      const max = Math.min(y + 1, height - y - 1)
      let i
      for (i = 0; i < max; ++i) {
        if (pattern[y - i] !== pattern[y + i + 1]) {
          break
        }
      }
      if (i === max) {
        vertical = y + 1
        if (verbose) {
          console.log('vertical', vertical)
        }
        break
      }
    }

    if (horizontal !== -1) {
      total += horizontal
    }
    if (vertical !== -1) {
      total += 100 * vertical
    }

    return total
  }, 0)
})
