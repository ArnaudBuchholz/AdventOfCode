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

  function getReflections (pattern) {
    const width = pattern[0].length
    const height = pattern.length

    const mirrorOnX = []
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
        mirrorOnX.push(x + 1)
      }
    }

    const mirrorOnY = []
    for (let y = 0; y < height - 1; ++y) {
      const max = Math.min(y + 1, height - y - 1)
      let i
      for (i = 0; i < max; ++i) {
        if (pattern[y - i] !== pattern[y + i + 1]) {
          break
        }
      }
      if (i === max) {
        mirrorOnY.push(y + 1)
      }
    }

    if (verbose) {
      console.log('reflections', 'x', mirrorOnX, 'y', mirrorOnY)
    }

    return {
      x: mirrorOnX,
      y: mirrorOnY
    }
  }

  function part1 (patterns) {
    return patterns.reduce((total, pattern) => {
      if (verbose) {
        console.log('\n' + pattern.join('\n'))
      }
      const { x, y } = getReflections(pattern)
      if (x.length > 1) {
        throw new Error('Unexpected')
      }
      if (x[0] !== undefined) {
        total += x[0]
      }
      if (y.length > 1) {
        throw new Error('Unexpected')
      }
      if (y[0] !== undefined) {
        total += 100 * y[0]
      }
      return total
    }, 0)
  }
  yield part1(patterns)

  function part2 (patterns) {
    return patterns.reduce((total, pattern) => {
      if (verbose) {
        console.log('\n' + pattern.join('\n'))
      }

      const { x: [initialX], y: [initialY] } = getReflections(pattern)

      const width = pattern[0].length
      const height = pattern.length
      for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
          const smudgedPattern = [...pattern]
          const smudge = smudgedPattern[y][x] === '.' ? '#' : '.'
          smudgedPattern[y] = smudgedPattern[y].substring(0, x) + smudge + smudgedPattern[y].substring(x + 1)

          if (verbose) {
            console.log(x, y, '\n' + smudgedPattern.join('\n'))
          }
          const { x: reflectionsOnX, y: reflectionsOnY } = getReflections(smudgedPattern)

          const smudgedX = reflectionsOnX.filter(x => x !== initialX)[0]
          if (smudgedX !== undefined) {
            if (verbose) {
              console.log('@', x, ',', y, 'new reflection on X', smudgedX)
            }
            return total + smudgedX
          }

          const smudgedY = reflectionsOnY.filter(x => x !== initialY)[0]
          if (smudgedY !== undefined) {
            if (verbose) {
              console.log('@', x, ',', y, 'new reflection on Y', smudgedY)
            }
            return total + smudgedY * 100
          }
        }
      }
      console.log('\n' + pattern.join('\n'))
      throw new Error('Unable to find smudge')
    }, 0)
  }
  yield part2(patterns)
})
