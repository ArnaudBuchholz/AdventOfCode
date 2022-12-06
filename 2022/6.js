require('../challenge')(async function * ({
  assert,
  lines
}) {
  const { unique } = await require('../lib/array')

  const PACKET = 4
  const MESSAGE = 14

  function startOf (size, stream) {
    const characters = stream.slice(0, size).split('')
    if (unique(characters)) {
      return size
    }
    for (let i = size; i < stream.length; ++i) {
      characters.shift()
      characters.push(stream[i])
      if (unique(characters)) {
        return i + 1
      }
    }
  }

  assert.strictEqual(startOf(PACKET, 'mjqjpqmgbljsphdztnvjfqwrcgsmlb'), 7)
  assert.strictEqual(startOf(PACKET, 'bvwbjplbgvbhsrlpgdmjqwftvncz'), 5)
  assert.strictEqual(startOf(PACKET, 'nppdvjthqldpwncqszvftbrmjlhg'), 6)
  assert.strictEqual(startOf(PACKET, 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'), 10)
  assert.strictEqual(startOf(PACKET, 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'), 11)

  yield startOf(PACKET, lines[0])

  assert.strictEqual(startOf(MESSAGE, 'mjqjpqmgbljsphdztnvjfqwrcgsmlb'), 19)
  assert.strictEqual(startOf(MESSAGE, 'bvwbjplbgvbhsrlpgdmjqwftvncz'), 23)
  assert.strictEqual(startOf(MESSAGE, 'nppdvjthqldpwncqszvftbrmjlhg'), 23)
  assert.strictEqual(startOf(MESSAGE, 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'), 29)
  assert.strictEqual(startOf(MESSAGE, 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'), 26)

  yield startOf(MESSAGE, lines[0])
})
