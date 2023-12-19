require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { getIntersection } = await require('../lib/range')

  const rules = {}
  const parts = []

  lines.forEach(line => {
    const rule = line.match(/(\w+)\{([^}]+)\}/)
    if (rule) {
      const [, name, content] = rule
      rules[name] = content.split(',').map(condition => {
        const match = condition.match(/(\w+)(<|>)(\d+):(\w+)/)
        if (match) {
          const [, field, operator, value, next] = match
          return {
            field,
            operator,
            value: Number(value),
            next
          }
        } else {
          return { next: condition }
        }
      })
    } else {
      const [, part] = line.match(/\{([^}]+)\}/)
      parts.push(part.split(',').reduce((accumulated, keyValue) => {
        const [key, value] = keyValue.split('=')
        accumulated[key] = Number(value)
        return accumulated
      }, {}))
    }
  })

  // if (verbose) {
  //   console.log(rules)
  //   console.log(parts)
  // }

  function isAccepted (part) {
    let ruleName = 'in'
    while (ruleName !== 'A' && ruleName !== 'R') {
      const rule = rules[ruleName]
      rule.every(({ field, operator, value, next }) => {
        if (field) {
          const partValue = part[field]
          let match
          if (operator === '<') {
            match = partValue < value
          } else {
            match = partValue > value
          }
          if (match) {
            ruleName = next
            return false // stop
          }
        } else {
          ruleName = next
          return false // stop
        }
        return true // continue
      })
    }
    return ruleName === 'A'
  }

  yield parts.filter(isAccepted).reduce((total, part) => total + Object.values(part).reduce((a, b) => a + b), 0)

  const accepted = []
  const MIN = 1
  const MAX = 4000
  const stack = [{
    path: [],
    ruleName: 'in',
    stepIndex: 0,
    x: [MIN, MAX],
    m: [MIN, MAX],
    a: [MIN, MAX],
    s: [MIN, MAX]
  }]
  while (stack.length) {
    const { path, ruleName, stepIndex, ...ranges } = stack.pop()
    const rule = rules[ruleName]
    const { field, operator, value, next } = rule[stepIndex]
    if (field) {
      const range = ranges[field]
      const compare = [
        operator === '<' ? MIN : value + 1,
        operator === '<' ? value - 1 : MAX
      ]
      const intersect = getIntersection(range, compare)
      if (intersect === null) {
        // else
        stack.push({
          path,
          ruleName,
          stepIndex: stepIndex + 1,
          ...ranges
        })
        continue // next
      }
      if (next === 'A') {
        accepted.push({
          path: [...path, ruleName],
          ...ranges,
          [field]: intersect
        })
      } else if (next !== 'R') {
        stack.push({
          path: [...path, ruleName],
          ruleName: next,
          stepIndex: 0,
          ...ranges,
          [field]: intersect
        })
      }
      // Anything else ?
      if (range[0] < intersect[0]) {
        stack.push({
          path,
          ruleName,
          stepIndex: stepIndex + 1,
          ...ranges,
          [field]: [range[0], intersect[0] - 1]
        })
      }
      if (range[1] > intersect[1]) {
        stack.push({
          path,
          ruleName,
          stepIndex: stepIndex + 1,
          ...ranges,
          [field]: [intersect[1] + 1, range[1]]
        })
      }
    } else {
      if (next === 'A') {
        accepted.push({ path, ...ranges })
      } else if (next !== 'R') {
        stack.push({
          path: [...path, ruleName],
          ruleName: next,
          stepIndex: 0,
          ...ranges
        })
      }
    }
  }

  // if (verbose) {
  //   console.log(accepted)
  // }

  yield accepted.reduce((total, { path, ...parts }) =>
    total + Object.values(parts).reduce((accumulated, range) => accumulated * (range[1] - range[0] + 1), 1)
  , 0)
})
