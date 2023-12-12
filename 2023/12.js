require('../challenge')(function * ({
  lines,
  verbose
}) {
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
      console.log(iterations, ':', processed, '|', pattern, groups)

      // Exit conditions
      if (groups.length === 0) {
        if (!pattern.includes('#')) {
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

    if (verbose) {
      console.log(line, '➔', arrangements, '(', iterations, ')')
    }
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

  yield lines.reduce((total, line) => total + getNumberOfArrangements(line), 0)

  const x5 = line => {
    const [p, v] = line.split(' ')
    return `${p}?${p}?${p}?${p}?${p} ${v},${v},${v},${v},${v}`
  }

  // getNumberOfArrangements(x5('???.### 1,1,3'), 1)
  // getNumberOfArrangements(x5('.??..??...?##. 1,1,3'), 16384)
  // getNumberOfArrangements(x5('?#?#?#?#?#?#?#? 1,3,1,6'), 1)
  // getNumberOfArrangements(x5('????.#...#... 4,1,1'), 16)
  // getNumberOfArrangements(x5('????.######..#####. 1,6,5'), 2500)
  // getNumberOfArrangements(x5('?###???????? 3,2,1'), 506250)

  // getNumberOfArrangements(x5('??????????? 2,3,2'))

  yield lines.reduce((total, line) => total + getNumberOfArrangements(x5(line)), 0)
})
