require('../challenge')(async function* ({
  assert,
  isSample,
  numbers
}) {
  console.log(numbers.join(','), numbers.length)

  // check if values are unique
  numbers.forEach(number => {
    assert.ok(numbers.filter(candidate => candidate === number).length === 1, 'values are unique')
  })

  function mix(encrypted, number) {
    const startingPos = encrypted.indexOf(number)
    assert.ok(startingPos !== -1)
    const { length } = encrypted
    let finalPos = startingPos
    if (number > 0) {
      finalPos += number
      while (finalPos >= length) {
        finalPos -= length - 1
      }
    } else if (number < 0) {
      finalPos += number
      while (finalPos <= 0) {
        finalPos += length - 1
      }
    }
    const decrypted = [...encrypted]
    if (startingPos < finalPos) {
      decrypted.splice(finalPos + 1, 0, number)
      decrypted.splice(startingPos, 1)
    } else {
      decrypted.splice(finalPos, 0, number)
      decrypted.splice(startingPos + 1, 1)
    }
    return decrypted
  }

  const check = (array, number, expected) => assert.strictEqual(mix(array, number).join(', '), expected.join(', '), `check([${array.join(', ')}], ${number}, [${expected.join(', ')}])`)

  check([1, 2, 3], 1, [2, 1, 3])
  check([2, 1, 3], 1, [2, 3, 1])
  check([2, 3, 1], 1, [2, 1, 3])

  check([1, 2, 3, 4], 1, [2, 1, 3, 4])
  check([2, 1, 3, 4], 1, [2, 3, 1, 4])
  check([2, 3, 1, 4], 1, [2, 3, 4, 1])
  check([2, 3, 4, 1], 1, [2, 1, 3, 4])

  check([-1, 2, 3], -1, [2, -1, 3])
  check([2, -1, 3], -1, [2, 3, -1])
  check([2, 3, -1], -1, [2, -1, 3])

  check([-1, 2, 3, 4], -1, [2, 3, -1, 4])
  check([2, -1, 3, 4], -1, [2, 3, 4, -1])
  check([2, 3, -1, 4], -1, [2, -1, 3, 4])
  check([2, 3, 4, -1], -1, [2, 3, -1, 4])

  check([1, 2, -3, 3, -2, 0, 4], 1, [2, 1, -3, 3, -2, 0, 4])
  check([2, 1, -3, 3, -2, 0, 4], 2, [1, -3, 2, 3, -2, 0, 4])
  check([1, -3, 2, 3, -2, 0, 4], -3, [1, 2, 3, -2, -3, 0, 4])
  check([1, 2, 3, -2, -3, 0, 4], 3, [1, 2, -2, -3, 0, 3, 4])
  check([1, 2, -2, -3, 0, 3, 4], -2, [1, 2, -3, 0, 3, 4, -2])
  check([1, 2, -3, 0, 3, 4, -2], 0, [1, 2, -3, 0, 3, 4, -2])
  check([1, 2, -3, 0, 3, 4, -2], 4, [1, 2, -3, 4, 0, 3, -2])

  let decrypted = [...numbers]
  numbers.forEach((number) => {
    decrypted = mix(decrypted, number)
  })

  if (isSample) {
    assert.strictEqual(decrypted.join(', '), '1, 2, -3, 4, 0, 3, -2')
  }

  const posOf0 = decrypted.indexOf(0)
  console.log()
  const first = decrypted[(posOf0 + 1000) % decrypted.length]
  const second = decrypted[(posOf0 + 2000) % decrypted.length]
  const third = decrypted[(posOf0 + 3000) % decrypted.length]
  console.log('Position of 0 :', posOf0, '\n1000th :', first, '\n2000th :', second, '\n3000th :', third)

  yield first + second + third // > 4060 > 4640
})
