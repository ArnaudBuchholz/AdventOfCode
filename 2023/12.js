require('../challenge')(function * ({
  lines,
  verbose
}) {
  function getNumberOfArrangements (line) {
    const [pattern, validation] = line.split(' ')
    const consecutiveGroups = validation.split(',').map(Number)
    const numberOfUnknowns = pattern.replace(/[^?]/g, '').length
    const numberOfAttempts = Math.pow(2, numberOfUnknowns)
    if (verbose) {
      console.log({
        pattern,
        consecutiveGroups,
        numberOfUnknowns,
        numberOfAttempts
      })
    }
    let arrangements = 0
    for (let attempt = 0; attempt < numberOfAttempts; ++attempt) {
      let bit = 1
      const resolved = pattern.replace(/\?/g, () => {
        const result = (attempt & bit) === bit ? '#' : '.'
        bit *= 2
        return result
      })
      const groups = []
      resolved.replace(/(#+)/g, match => groups.push(match.length))
      let ok = false
      if (groups.length === consecutiveGroups.length && groups.every((count, index) => consecutiveGroups[index] === count)) {
        ++arrangements
        ok = true
      }
      if (verbose) {
        console.log(attempt, resolved, groups, ok)
      }
    }
    if (verbose) {
      console.log({ arrangements })
    }
    return arrangements
  }

  // getNumberOfArrangements('???.### 1,1,3')
  // getNumberOfArrangements('.??..??...?##. 1,1,3 ')
  // getNumberOfArrangements('?###???????? 3,2,1')

  yield lines.reduce((total, line) => total + getNumberOfArrangements(line), 0)
})
