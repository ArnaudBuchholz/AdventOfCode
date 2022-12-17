const { buildTests } = require('./tests-builder')
const {
  unique,
  detectRepetitionPattern
} = require('./array')

describe('array', buildTests({
  unique: {
    method: unique,
    tests: [
      { i: ['abcdef'.split('')], o: true },
      { i: ['abcadef'.split('')], o: false },
      { i: [[]], o: true },
      { i: [[1, 2]], o: true },
      { i: [[1, 2, 1]], o: false }
    ]
  },
  detectRepetitionPattern: {
    method: detectRepetitionPattern,
    tests: [
      { i: ['abc'], o: undefined },
      { i: ['abab'], o: { skip: 0, length: 2 } },
      { i: ['ababa'], o: { skip: 0, length: 2 } },
      { i: ['ababc'], o: undefined },
      { i: ['0abab'], o: { skip: 1, length: 2 } },
      { i: ['0ababa'], o: { skip: 1, length: 2 } },
      { i: ['0ababc'], o: undefined },
      { i: ['00abab'], o: { skip: 2, length: 2 } },
      { i: ['00ababa'], o: { skip: 2, length: 2 } },
      { i: ['00ababc'], o: undefined },
      { i: ['000abab'], o: { skip: 3, length: 2 } },
      { i: ['000ababa'], o: { skip: 3, length: 2 } },
      { i: ['000ababc'], o: undefined }
    ]
  }
}))
