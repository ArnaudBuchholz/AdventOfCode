const assert = require('assert')
const input = require('./input')
  .split(/\r?\n/)
  .filter(line => !!line)

const openings = ['(', '[', '{', '<']
const closings = [')', ']', '}', '>']
const syntaxErrorPoints = { ')': 3, ']': 57, '}': 1197, '>': 25137 }
const missingPoints = { ')': 1, ']': 2, '}': 3, '>': 4 }

/*
  chunks -> chunk*
  chunk -> (chunks) | [chunks] | {chunks} | <chunks>
*/

function chunk (parser) {
  const openingType = openings.indexOf(parser.get())
  const expectedClosing = closings[openingType]
  parser.next()
  if (chunks(parser) || parser.get() !== expectedClosing) {
    parser.missing(expectedClosing)
    return true
  }
  parser.next()
  return false
}

function chunks (parser) {
  while (openings.includes(parser.get())) {
    if (chunk(parser)) {
      return true
    }
  }
  return false
}

function parse (code) {
  let index = 0
  const missing = []
  const parser = {
    get () { return code[index] },
    next () { ++index },
    missing (char) { missing.push(char) }
  }
  const result = chunks(parser)
  if (result === true || index < code.length) {
    const char = code[index]
    if (char !== undefined) {
      return { index, char }
    }
    return { index, char, missing }
  }
  return undefined // ok
}

assert.strictEqual(parse('<>'), undefined)
assert.strictEqual(parse('<>[]'), undefined)
assert.strictEqual(parse('<{}>[]'), undefined)
assert.strictEqual(parse('<{}()>[(){<>}]'), undefined)
assert.strictEqual(parse('<{}()>[(){<>}]'), undefined)
assert.deepEqual(parse('<{>()>[(){<>}]'), { index: 2, char: '>' })
assert.deepEqual(parse('<{}(}>[(){<>}]'), { index: 4, char: '}' })
assert.deepEqual(parse('['), { index: 1, char: undefined, missing: [']'] })
assert.deepEqual(parse('[{[{({})'), { index: 8, char: undefined, missing: ['}', ']', '}', ']'] })

const syntaxErrorScore = input.reduce((sum, line) => {
  const parsed = parse(line)
  if (parsed && parsed.char) {
    return sum + syntaxErrorPoints[parsed.char]
  }
  return sum
}, 0)
console.log('Part 1 :', syntaxErrorScore)

const completionStringsScore = input
  .map(line => {
    const parsed = parse(line)
    if (parsed.missing) {
      return parsed.missing.reduce((total, char) => 5 * total + missingPoints[char], 0)
    }
    return 0
  })
  .filter(score => score > 0)
  .sort((a, b) => b - a)
console.log('Part 2 :', completionStringsScore[(completionStringsScore.length - 1) / 2])
