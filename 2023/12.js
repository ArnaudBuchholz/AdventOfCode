require('../challenge')(function * ({
  lines,
  verbose
}) {
  function getNumberOfArrangements (line) {
    const parts = line.split(' ')
    const stack = [{
      processed: '',
      pattern: parts[0].split(''),
      groups: parts[1].split(',').map(Number),
      expected: ''
    }]
    let arrangements = 0
    let iterations = 0

    while (stack.length) {
      ++iterations
      const {
        processed,
        pattern: [current, ...pattern],
        groups,
        expected
      } = stack.pop()

      // Exit conditions
      if (current === undefined && expected !== '#' && groups.length === 0) {
        ++arrangements
        continue // YES
      }
      if (current === undefined ||
        (expected === '.' && current === '#') ||
        (expected === '#' && current === '.') ||
        (groups.length === 0 && (current === '#' || pattern.includes('#')))
      ) {
        continue // NOPE
      }

      const checkGroup = () => {
        if (current === '.') {
          return // NOPE
        }
        // Otherwise we have # or ?
        const [left, ...otherGroups] = groups
        if (left === 1) {
          stack.push({
            processed: processed + '#', // current,
            pattern,
            groups: otherGroups,
            expected: '.'
          })
        } else {
          stack.push({
            processed: processed + '#', // current,
            pattern,
            groups: [left - 1, ...otherGroups],
            expected: '#'
          })
        }
      }

      const next = () => stack.push({
        processed: processed + '.', // current
        pattern,
        groups,
        expected: ''
      })

      if (expected === '.') {
        next()
      } else if (expected === '#') {
        checkGroup()
      } else { // expected = ''
        if (current === '.') {
          next()
        } else if (current === '#') {
          checkGroup()
        } else if (current === '?') {
          next()
          checkGroup()
        }
      }
    }

    if (verbose) {
      console.log(line, '➔', arrangements, '(', iterations, ')')
    }
    return arrangements
  }

  // getNumberOfArrangements('???.### 1,1,3')
  // getNumberOfArrangements('.??..??...?##. 1,1,3 ')
  // getNumberOfArrangements('????.######..#####. 1,6,5')
  // getNumberOfArrangements('?###???????? 3,2,1')
  // getNumberOfArrangements('.???#?#????..????. 1,4,1,1,2,1')

  yield lines.reduce((total, line) => total + getNumberOfArrangements(line), 0)

  const x5 = line => {
    const [p, v] = line.split(' ')
    return `${p}?${p}?${p}?${p}?${p} ${v},${v},${v},${v},${v}`
  }

  // getNumberOfArrangements(x5('???.### 1,1,3'))
  // getNumberOfArrangements(x5('?###???????? 3,2,1'))
  // getNumberOfArrangements(x5('.???#?#????..????. 1,4,1,1,2,1'))

  // yield lines.reduce((total, line) => total + getNumberOfArrangements(x5(line)), 0)
})
