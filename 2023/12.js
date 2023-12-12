require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { gcd } = await require('../lib/math')

  function getNumberOfArrangements (line, expected) {
    const parts = line.split(' ')
    const stack = [{
      processed: '',
      pattern: parts[0],
      groups: parts[1].split(',').map(Number)
    }]
    let arrangements = 0
    let iterations = 0

    while (stack.length) {
      const {
        processed,
        pattern,
        groups
      } = stack.pop()

      ++iterations
      // console.log(iterations, ':', processed, '|', pattern, groups)

      // Exit conditions
      if (groups.length === 0) {
        if (!pattern.includes('#')) {
          // console.log(iterations, ':', processed, '|', pattern)
          ++arrangements // YES
        }
        continue
      } else if (pattern.length === 0) {
        continue
      }

      const checkGroup = () => {
        const [count] = groups
        if (pattern.length < count) {
          return // NOPE
        }
        if (pattern.substring(0, count).includes('.')) {
          return // NOPE
        }
        if (pattern[count] === '#') {
          return // NOPE
        }
        stack.push({
          processed: processed + ''.padStart(count, '#') + '.',
          pattern: pattern.substring(count + 1), // consume . or ?
          groups: groups.slice(1)
        })
      }

      const skipDotsMatch = pattern.match(/^\.+/)
      if (skipDotsMatch) {
        const skipDots = skipDotsMatch[0]
        stack.push({
          processed: processed + skipDots,
          pattern: pattern.substring(skipDots.length),
          groups
        })
      } else if (pattern[0] === '#') {
        checkGroup()
      } else { // ?
        stack.push({
          processed: processed + '.',
          pattern: pattern.substring(1),
          groups
        })
        checkGroup()
      }
    }

    // if (verbose) {
    //   console.log(line, '➔', arrangements, '(', iterations, ')')
    // }
    if (expected !== undefined && expected !== arrangements) {
      throw new Error('failed')
    }
    return arrangements
  }

  // getNumberOfArrangements('???.### 1,1,3', 1)
  // getNumberOfArrangements('.??..??...?##. 1,1,3 ', 4)
  // getNumberOfArrangements('?#?#?#?#?#?#?#? 1,3,1,6', 1)
  // getNumberOfArrangements('????.#...#... 4,1,1', 1)
  // getNumberOfArrangements('????.######..#####. 1,6,5', 4)
  // getNumberOfArrangements('?###???????? 3,2,1', 10)
  // getNumberOfArrangements('.???#?#????..????. 1,4,1,1,2,1')
  // getNumberOfArrangements('??????????? 2,3,2', 10)

  const x2 = line => {
    const [p, v] = line.split(' ')
    return `${p}?${p} ${v},${v}`
  }

  // getNumberOfArrangements(x2('????.#...#... 4,1,1', 1))
  // getNumberOfArrangements(x2('?###???????? 3,2,1'))

  yield lines.reduce((total, line) => total + getNumberOfArrangements(line), 0)

  const getNumberOfArrangementsX5 = (line, expected) => {
    const one = getNumberOfArrangements(line)
    const two = getNumberOfArrangements(x2(line))
    const geaterCommonDenominator = gcd(one, two)
    const arrangements = two * two * two * two / (geaterCommonDenominator * geaterCommonDenominator * geaterCommonDenominator)
    if (verbose) {
      console.log(line, one, two, geaterCommonDenominator, arrangements)
    }
    if (arrangements % 1 !== 0) {
      throw new Error('failed')
    }
    if (expected !== undefined && expected !== arrangements) {
      throw new Error('failed')
    }
    return arrangements
  }

  getNumberOfArrangementsX5('???.### 1,1,3', 1)
  getNumberOfArrangementsX5('.??..??...?##. 1,1,3', 16384)
  getNumberOfArrangementsX5('?#?#?#?#?#?#?#? 1,3,1,6', 1)
  getNumberOfArrangementsX5('????.#...#... 4,1,1', 16)
  getNumberOfArrangementsX5('????.######..#####. 1,6,5', 2500)
  getNumberOfArrangementsX5('?###???????? 3,2,1', 506250)

  // 18672550515010077000 is too high
  // yield lines.reduce((total, line) => total + getNumberOfArrangementsX5(line), 0)
})
