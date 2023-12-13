require('../challenge')(function * ({
  lines,
  verbose
}) {
  const precomputed = new Map()

  function getNumberOfArrangements (line, expected) {
    const [pattern, rawGroups] = line.split(' ')
    const groups = rawGroups.split(',').map(Number)

    let iterations = 0

    function count (pattern, groups) {
      ++iterations

      pattern = pattern.replace(/^\.+|\.+$/, '') // remove starting & ending .
      if (pattern === '') {
        if (groups.length === 0) {
          return 1 // all done
        } else {
          return 0 // unfound groups
        }
      }

      if (groups.length === 0) {
        if (pattern.includes('#')) {
          return 0 // unmatched groups
        } else {
          return 1 // all done
        }
      }

      const key = pattern + '|' + groups.join(',')
      if (precomputed.has(key)) {
        return precomputed.get(key)
      }

      let arrangements = 0

      const startWithFullGroup = pattern.match(/^#+(?=\.|$)/) // . or end of string included
      if (startWithFullGroup) {
        const [firstGroupSize, ...otherGroups] = groups
        if (startWithFullGroup[0].length === firstGroupSize) {
          arrangements += count(pattern.substring(firstGroupSize), otherGroups)
        }
      } else if (pattern.includes('?')) {
        const totalOfGroups = groups.reduce((a, b) => a + b)
        arrangements += count(pattern.replace('?', '.'), groups)
        if (pattern.replace(/[^#]/g, '').length < totalOfGroups) {
          arrangements += count(pattern.replace('?', '#'), groups)
        }
      }

      precomputed.set(key, arrangements)
      return arrangements
    }

    const arrangements = count(pattern, groups)
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
  // getNumberOfArrangements(x5('???????????? 3,2,1'))

  yield lines.reduce((total, line) => total + getNumberOfArrangements(x5(line)), 0)
})
