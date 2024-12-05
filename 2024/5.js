require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const orderingRules = []
  const updates = []

  lines.forEach(line => {
    if (line.includes('|')) {
      const [before, after] = line.split('|').map(Number)
      orderingRules.push({ before, after })
    } else if (line.includes(',')) {
      updates.push(line.split(',').map(Number))
    }
  })

  if (verbose) {
    console.log('orderingRules:', orderingRules)
    console.log('updates:', updates)
  }

  function isValid (update) {
    for (let index = 0; index < update.length - 1; ++index) {
      const beforeToCheck = update[index]
      for (let nextIndex = index + 1; nextIndex < update.length; ++nextIndex) {
        const afterToCheck = update[nextIndex]
        if (!orderingRules.every(({ before, after }) => {
          if (after === beforeToCheck && before === afterToCheck) {
            return false
          }
          return true
        })) {
          return false
        }
      }
    }
    return true
  }

  if (verbose) {
    updates.forEach(update => {
      console.log(isValid(update) ? '✅' : '❌', update, isValid(update) ? update[Math.floor(update.length / 2)] : '')
    })
  }

  yield updates.reduce((total, update) => isValid(update) ? total + update[Math.floor(update.length / 2)] : total, 0)

  let fixedTotal = 0
  updates.forEach(update => {
    if (!isValid(update)) {
      const fixed = [...update]
      fixed.sort((a, b) => {
        const orderingRule = orderingRules.filter(({ before, after }) => (before === a && after === b) || (before === b && after === a))[0]
        if (orderingRule) {
          return orderingRule.before === a ? -1 : 1
        }
        return 0
      })
      if (verbose) {
        console.log('fixed', update, 'to', fixed)
      }
      fixedTotal += fixed[Math.floor(update.length / 2)]
    }
  })
  yield fixedTotal
})
