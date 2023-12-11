require('../challenge')(async function * ({
  isSample,
  lines,
  verbose
}) {
  const usedXs = []
  const usedYs = []
  const galaxies = []
  lines.forEach((line, y) => {
    line.replace(/#/g, (match, x) => {
      if (!usedYs.includes(y)) {
        usedYs.push(y)
      }
      if (!usedXs.includes(x)) {
        usedXs.push(x)
      }
      galaxies.push({ x, y })
      return '#'
    })
  })
  if (verbose) {
    console.log('Detection :')
    console.log('\tGalaxies :', galaxies)
    console.log('\tColumns :', usedXs)
    console.log('\tLines :', usedYs)
  }

  function distance (g1, g2, weightOfUnused) {
    let result = -2
    const startX = Math.min(g1.x, g2.x)
    const endX = Math.max(g1.x, g2.x)
    for (let x = startX; x <= endX; ++x) {
      if (usedXs.includes(x)) {
        ++result
      } else {
        result += weightOfUnused
      }
    }
    const startY = Math.min(g1.y, g2.y)
    const endY = Math.max(g1.y, g2.y)
    for (let y = startY; y <= endY; ++y) {
      if (usedYs.includes(y)) {
        ++result
      } else {
        result += weightOfUnused
      }
    }
    return result
  }

  function distanceBetweenGalaxies (weightOfUnused) {
    let sum = 0
    for (let i = 0; i < galaxies.length; ++i) {
      for (let j = i + 1; j < galaxies.length; ++j) {
        const distanceBetween = distance(galaxies[i], galaxies[j], weightOfUnused)
        sum += distanceBetween
        if (verbose) {
          console.log(i, '⟺ ', j, ' = ', distanceBetween)
        }
      }
    }
    return sum
  }

  yield distanceBetweenGalaxies(2)
  if (isSample) {
    console.log(10, distanceBetweenGalaxies(10))
    console.log(100, distanceBetweenGalaxies(100))
  }
  yield distanceBetweenGalaxies(1000000)
})
