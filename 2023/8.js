require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { gcd } = await require('../lib/math')

  const directions = lines[0]
  const map = lines.slice(1).reduce((accumulator, line) => {
    const [, pos, left, right] = line.match(/(\w+) = \((\w+), (\w+)\)/)
    accumulator[pos] = { left, right }
    return accumulator
  }, {})

  if (verbose) {
    console.log(map)
  }

  function getNumberOfSteps (from, end, count = 1) {
    let pos = from
    let steps = 0
    const results = []

    const next = () => {
      const step = directions[steps % directions.length]
      ++steps
      let result
      if (step === 'L') {
        result = map[pos].left
      } else {
        result = map[pos].right
      }
      // if (verbose) {
      //   console.log(steps, pos, step, result)
      // }
      return result
    }

    while (!pos.endsWith(end)) {
      pos = next()
    }
    results.push(steps)

    while (--count > 0) {
      do {
        pos = next()
      } while (!pos.endsWith(end))
      results.push(steps)
    }

    return results
  }

  if (map.AAA !== undefined) {
    yield getNumberOfSteps('AAA', 'ZZZ')[0]
  }

  const starts = Object.keys(map).filter(name => name.endsWith('A'))
  if (verbose) {
    console.log('Part 2 starts :', starts)
  }

  const steps = starts.map(start => getNumberOfSteps(start, 'Z', 5))
  // Assuming the cycle is based on first result
  const baseCount = Math.max(...steps.map(results => results[0]))
  const geaterCommonDenominator = gcd(...steps.map(results => results[0]))

  if (verbose) {
    starts.forEach((start, index) => {
      console.log(start, steps[index].join(', '))
    })
    console.log('base :', baseCount)
    console.log('gcd  :', geaterCommonDenominator)
  }

  yield steps.reduce((total, results) => total * (results[0] / geaterCommonDenominator), geaterCommonDenominator)
})
