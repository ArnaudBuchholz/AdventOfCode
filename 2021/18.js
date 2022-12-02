require('../challenge')(function * ({
  lines,
  verbose,
  assert
}) {
  const numbers = lines.map(eval) // eslint-disable-line

  function toDepthsAndValues (number) {
    const depths = []
    const values = []
    function walk (pair, depth = 1) {
      if (Array.isArray(pair[0])) {
        walk(pair[0], depth + 1)
      } else {
        depths.push(depth)
        values.push(pair[0])
      }
      if (Array.isArray(pair[1])) {
        walk(pair[1], depth + 1)
      } else {
        depths.push(depth)
        values.push(pair[1])
      }
    }
    walk(number)
    return { depths, values }
  }

  assert.deepEqual(toDepthsAndValues([[[[[9, 8], 1], 2], 3], 4]).values, [9, 8, 1, 2, 3, 4])
  assert.deepEqual(toDepthsAndValues([[[[[9, 8], 1], 2], 3], 4]).depths, [5, 5, 4, 3, 2, 1])

  function fromDepthsAndValues (depths, values) {
    let index = 0
    function walk (number, depth) {
      if (depths[index] > depth) {
        number[0] = walk([], depth + 1)
      } else {
        number[0] = values[index]
        ++index
      }
      if (depths[index] > depth) {
        number[1] = walk([], depth + 1)
      } else {
        number[1] = values[index]
        ++index
      }
      return number
    }
    return walk([], 1)
  }

  assert.deepEqual(fromDepthsAndValues([5, 5, 4, 3, 2, 1], [9, 8, 1, 2, 3, 4]), [[[[[9, 8], 1], 2], 3], 4])

  function explode (number) {
    const { depths, values } = toDepthsAndValues(number)
    const index = depths.findIndex(d => d > 4)
    if (index !== -1) {
      const [left, right] = values.slice(index)
      if (index === 0) {
        depths.shift()
        values.shift()
        depths[0]--
        values[0] = 0
        values[1] += right
      } else if (index === values.length - 2) {
        depths.pop()
        values.pop()
        const last = depths.length - 1
        depths[last]--
        values[last] = 0
        values[last - 1] += left
      } else {
        values[index - 1] += left
        values[index] = 0
        depths[index]--
        values[index + 2] += right
        values.splice(index + 1, 1)
        depths.splice(index + 1, 1)
      }
      return fromDepthsAndValues(depths, values)
    }
    return number
  }

  assert.deepEqual(explode([[[[[9, 8], 1], 2], 3], 4]), [[[[0, 9], 2], 3], 4])
  assert.deepEqual(explode([7, [6, [5, [4, [3, 2]]]]]), [7, [6, [5, [7, 0]]]])
  assert.deepEqual(explode([[6, [5, [4, [3, 2]]]], 1]), [[6, [5, [7, 0]]], 3])
  assert.deepEqual(explode([[3, [2, [1, [7, 3]]]], [6, [5, [4, [3, 2]]]]]), [[3, [2, [8, 0]]], [9, [5, [4, [3, 2]]]]])
  assert.deepEqual(explode([[3, [2, [8, 0]]], [9, [5, [4, [3, 2]]]]]), [[3, [2, [8, 0]]], [9, [5, [7, 0]]]])

  function split (number) {
    const { depths, values } = toDepthsAndValues(number)
    const index = values.findIndex(d => d >= 10)
    if (index !== -1) {
      const d = values[index]
      const left = Math.floor(d / 2)
      const right = d - left
      depths[index]++
      values[index] = left
      depths.splice(index + 1, 0, depths[index])
      values.splice(index + 1, 0, right)
      return fromDepthsAndValues(depths, values)
    }
    return number
  }

  assert.deepEqual(split([1, 2]), [1, 2])
  assert.deepEqual(split([1, 10]), [1, [5, 5]])
  assert.deepEqual(split([1, 11]), [1, [5, 6]])
  assert.deepEqual(split([[[[0, 7], 4], [15, [0, 13]]], [1, 1]]), [[[[0, 7], 4], [[7, 8], [0, 13]]], [1, 1]])

  function render (number) {
    if (Array.isArray(number)) {
      return `[${render(number[0])},${render(number[1])}]`
    }
    return number
  }

  function reduce (number) {
    while (true) {
      const explodeResult = explode(number)
      if (explodeResult !== number) {
        number = explodeResult
        if (verbose) {
          console.log(render(number))
        }
        continue
      }
      const splitResult = split(number)
      if (splitResult === number) {
        break
      } else {
        number = splitResult
        if (verbose) {
          console.log(render(number))
        }
      }
    }
    return number
  }

  function sum (a, b) {
    return reduce([a, b])
  }

  assert.deepEqual(sum([[[[4, 3], 4], 4], [7, [[8, 4], 9]]], [1, 1]), [[[[0, 7], 4], [[7, 8], [6, 0]]], [8, 1]])

  function magnitude (number) {
    if (Array.isArray(number)) {
      return 3 * magnitude(number[0]) + 2 * magnitude(number[1])
    }
    return number
  }

  assert.strictEqual(magnitude([[1, 2], [[3, 4], 5]]), 143)
  assert.strictEqual(magnitude([[[[8, 7], [7, 7]], [[8, 6], [7, 7]]], [[[0, 7], [6, 6]], [8, 7]]]), 3488)

  const totalSum = numbers.reduce((currentSum, number) => sum(currentSum, number))
  const magnitudeOfTotalSum = magnitude(totalSum)
  yield magnitudeOfTotalSum

  let highestMagnitude = 0
  numbers.forEach((a, indexOfA) => {
    numbers.forEach((b, indexOfB) => {
      if (indexOfA !== indexOfB) {
        highestMagnitude = Math.max(highestMagnitude, magnitude(sum(a, b)))
      }
    })
  })
  yield highestMagnitude
})
