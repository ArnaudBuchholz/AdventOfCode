require('../challenge')(function * ({
  assert,
  lines
}) {
  const priority = item => {
    const c = item.charCodeAt(0)
    if (c < 96) {
      return c - 65 + 27
    }
    return c - 97 + 1
  }

  assert.strictEqual(priority('a'), 1)
  assert.strictEqual(priority('z'), 26)
  assert.strictEqual(priority('A'), 27)
  assert.strictEqual(priority('Z'), 52)

  const checkItems = items => {
    if (items.length !== 1) {
      const [first, ...others] = items
      assert.ok(others.every(other => other === first), 'Items are of the same type')
    } else {
      assert.strictEqual(items.length, 1)
    }
  }

  yield lines.reduce((total, line) => {
    const halfLength = line.length / 2
    const first = line.substring(0, halfLength)
    const second = line.substring(halfLength)
    assert.strictEqual(first.length, halfLength)
    assert.strictEqual(first.length, second.length)
    const commonItems = first.split('').filter(c => second.includes(c))
    checkItems(commonItems)
    return total + priority(commonItems[0])
  }, 0)

  assert.ok(lines.length % 3 === 0, 'Lines can be divided by 3')

  const groupItems = lines.reduce((groupItems, line, index) => {
    if (index % 3 === 0) {
      groupItems.push(line.split(''))
    } else {
      const items = groupItems.pop()
      groupItems.push(items.filter(item => line.includes(item)))
    }
    return groupItems
  }, [])

  console.log(groupItems)

  yield groupItems.reduce((total, items) => {
    checkItems(items)
    return total + priority(items[0])
  }, 0)
})
