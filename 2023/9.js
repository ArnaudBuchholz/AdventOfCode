require('../challenge')(function * ({
  lines,
  verbose
}) {
  const measures = lines.map(line => line.split(' ').map(Number))

  if (verbose) {
    console.log(measures)
  }

  const [start, end] = measures.reduce(([accStart, accEnd], valuesOverTime) => {
    const differences = []
    let difference = [...valuesOverTime]
    let end = difference.at(-1)
    while (!difference.every(value => value === 0)) {
      difference = difference.slice(1).map((value, index) => value - difference[index])
      differences.push(difference)
      end += difference.at(-1)
    }
    const start = valuesOverTime[0] - [...differences].reverse().slice(1).reduce((lastStart, [first]) => first - lastStart, 0)
    if (verbose) {
      console.log(valuesOverTime, start, end)
      differences.forEach(difference => console.log(difference.join(', ')))
    }
    return [accStart + start, accEnd + end]
  }, [0, 0])

  yield end
  yield start
})
