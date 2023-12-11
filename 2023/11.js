require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const usedColumns = []
  lines.forEach(line => {
    line.replace(/#/g, (match, offset) => {
      if (!usedColumns.includes(offset)) {
        usedColumns.push(offset)
      }
      return '#'
    })
  })
  usedColumns.sort()
  if (verbose) {
    console.log('Detected columns to be used :', usedColumns)
  }

  // expand
  const expanded = lines.map(line => {
    const chars = line.split('').map((char, index) => {
      if (usedColumns.includes(index)) {
        return char
      }
      if (char !== '.') {
        throw new Error('Should not be !')
      }
      return [char, char]
    }).flat().join('')

    if (!line.includes('#')) {
      return [chars, chars]
    }
    return chars
  }).flat()
  if (verbose) {
    console.log('Expanded universe :\n' + expanded.join('\n'))
  }

  // Another approach could be to value some lines & columns 2 instead of 1

  const galaxies = []
  expanded.forEach((line, y) => {
    line.replace(/#/g, (match, x) => {
      galaxies.push({ x, y })
      return '#'
    })
  })
  if (verbose) {
    console.log('Galaxies :', galaxies)
  }

  function distance (g1, g2) {
    return Math.abs(g2.x - g1.x) + Math.abs(g2.y - g1.y)
  }

  let sum = 0
  for (let i = 0; i < galaxies.length; ++i) {
    for (let j = i + 1; j < galaxies.length; ++j) {
      const distanceBetween = distance(galaxies[i], galaxies[j])
      sum += distanceBetween
      if (verbose) {
        console.log(i, '⟺ ', j, ' = ', distanceBetween)
      }
    }
  }

  yield sum

})
  