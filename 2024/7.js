require('../challenge')(function * ({
  lines,
  verbose
}) {
  const equations = lines.map(line => {
    const total = Number(line.split(':')[0])
    const values = line.split(':')[1].split(' ').slice(1).map(Number)
    if (verbose) {
      console.log(total, ':', values)
    }
    return { total, values }
  })

  if (verbose) {
    console.log('Part 1 :\n--------')
  }

  let part1 = 0
  const part1Indexes = []

  equations.forEach(({ total, values }, equationIndex) => {
    const max = 2 ** (values.length - 1)
    for (let combination = 0; combination < max; ++combination) {
      const attempt = values.reduce((current, value, index) => {
        const bit = 2 ** (index - 1)
        if ((bit & combination) === bit) {
          return current + value
        }
        return current * value
      })
      if (verbose) {
        console.log(total, '?', values[0] + combination.toString(2).padEnd(values.length - 1, '0').split('').map((bit, index) => {
          const operator = bit === '1' ? '+' : '*'
          return operator + values[index + 1]
        }).join(''), '=', attempt, total === attempt ? '✅' : '')
      }
      if (attempt === total) {
        part1 += total
        part1Indexes.push(equationIndex)
        break
      }
    }
  })

  yield part1

  if (verbose) {
    console.log('Part 2 :\n--------')
  }

  let part2 = 0

  equations.forEach(({ total, values }, equationIndex) => {
    if (part1Indexes.includes(equationIndex)) {
      return // SKIP
    }
    const max = 3 ** (values.length - 1)
    for (let combination = 0; combination < max; ++combination) {
      let remainingCombination = combination
      let attempt
      for (const value of values) {
        if (attempt === undefined) {
          attempt = value
          continue
        }
        const bit = remainingCombination % 3
        remainingCombination = (remainingCombination - bit) / 3
        if (bit === 0) {
          attempt += value
        } else if (bit === 1) {
          attempt *= value
        } else {
          attempt = parseInt('' + attempt + value)
        }
        if (attempt > total) {
          attempt = Number.POSITIVE_INFINITY
          break
        }
      }
      if (verbose) {
        console.log(total, '?', values[0] + combination.toString(3).padEnd(values.length - 1, '0').split('').map((bit, index) => {
          const operator = ['+', '*', '||'][bit]
          return operator + values[index + 1]
        }).join(''), '=', attempt === Number.POSITIVE_INFINITY ? '❌' : attempt, total === attempt ? '✅' : '')
      }
      if (attempt === total) {
        part2 += total
        break
      }
    }
  })

  yield part1 + part2
})
