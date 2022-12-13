require('../challenge')(async function * ({
  isSample,
  assert,
  lines
}) {
  const pairs = lines.reduce((grouped, line, index) => {
    if (index % 2 === 0) {
      grouped.push({
        index: index / 2 + 1,
        // eslint-disable-next-line no-eval
        left: eval(line),
        // eslint-disable-next-line no-eval
        right: eval(lines[index + 1])
      })
    }
    return grouped
  }, [])

  // return false, true or undefined (if not determined)
  function compare (left, right) {
    const typeofLeft = typeof left
    const typeofRight = typeof right
    if (typeofLeft === typeofRight) {
      // Both numbers
      if (typeofLeft === 'number') {
        if (left === right) {
          return undefined
        }
        return left < right
      }
      // Both list
      const result = left
        .slice(0, Math.min(left.length, right.length))
        .reduce((result, value, index) => {
          if (result === undefined) {
            result = compare(value, right[index])
          }
          return result
        }, undefined)
      if (result !== undefined) {
        return result
      }
      if (left.length === right.length) {
        return undefined
      }
      return left.length < right.length
    } else {
      // Not the same type
      if (typeofLeft === 'number') {
        return compare([left], right)
      }
      return compare(left, [right])
    }
  }

  console.log(pairs)

  if (isSample) {
    assert.strictEqual(compare(pairs[0].left, pairs[0].right), true)
    assert.strictEqual(compare(pairs[1].left, pairs[1].right), true)
    assert.strictEqual(compare(pairs[2].left, pairs[2].right), false)
    assert.strictEqual(compare(pairs[3].left, pairs[3].right), true)
    assert.strictEqual(compare(pairs[4].left, pairs[4].right), false)
    assert.strictEqual(compare(pairs[5].left, pairs[5].right), true)
    assert.strictEqual(compare(pairs[6].left, pairs[6].right), false)
    assert.strictEqual(compare(pairs[7].left, pairs[7].right), false)
  }

  yield pairs.reduce((total, { index, left, right }) => {
    if (compare(left, right)) {
      return total + index
    }
    return total
  }, 0)

  const divPacket1 = [[2]]
  const divPacket2 = [[6]]

  const packets = [
    divPacket1,
    divPacket2,
    ...pairs.map(({ left }) => left),
    ...pairs.map(({ right }) => right)
  ].sort((p1, p2) => ({
    undefined: 0,
    true: -1,
    false: 1
  })[compare(p1, p2)]
  )

  console.log(packets)

  yield (packets.indexOf(divPacket1) + 1) * (packets.indexOf(divPacket2) + 1)
})
