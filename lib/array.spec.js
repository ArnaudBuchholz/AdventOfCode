const { buildTests } = require('./tests-builder')
const {
  unique
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
  }
}))
