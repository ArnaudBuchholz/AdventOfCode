require('../challenge')(function * ({
  lines,
  verbose
}) {
  const directions = lines[0]
  const map = lines.slice(1).reduce((accumulator, line) => {
    const [, pos, left, right] = line.match(/(\w+) = \((\w+), (\w+)\)/)
    accumulator[pos] = { left, right }
    return accumulator
  }, {})

  // if (verbose) {
  //   console.log(map)
  // }

  function getNumberOfSteps (from, end) {
    let pos = from
    let steps = 0

    const next = () => {
      const step = directions[steps % directions.length]
      ++steps
      if (step === 'L') {
        return map[pos].left
      }
      return map[pos].right
    }

    // count = number of steps to reach end
    while (!pos.endsWith(end)) {
      pos = next()
    }
    const count = steps

    // cycle = number of steps to come back to end
    let cycle = 0
    if (end !== 'ZZZ') {
      do {
        pos = next()
        ++cycle
      } while (!pos.endsWith(end))
    }

    return { count, cycle }
  }

  yield getNumberOfSteps('AAA', 'ZZZ').count

  const starts = Object.keys(map).filter(name => name.endsWith('A'))
  if (verbose) {
    console.log('Part 2 starts :', starts)
  }

  const steps = starts.map(start => getNumberOfSteps(start, 'Z'))
  const baseCount = steps.reduce((max, { count }) => Math.max(max, count), 0)

  if (verbose) {
    starts.forEach((start, index) => {
      console.log(start, steps[index])
    })
    console.log('base count :', baseCount)
  }
})
