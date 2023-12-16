const { buildTests } = require('./tests-builder')
const {
  unique,
  detectRepetitionPattern,
  column,
  plot
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
  },
  column: {
    method: column,
    tests: [
      {
        i: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]], 1],
        o: [2, 5, 8]
      },
      {
        i: [['123', '456', '789'], 1],
        o: ['2', '5', '8']
      }
    ]
  },
  plot: {
    method: plot,
    tests: [
      {
        i: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]], 1, 1, 0],
        o: [[1, 2, 3], [4, 0, 6], [7, 8, 9]]
      },
      {
        i: [['123', '456', '789'], 1, 1, 0],
        o: ['123', '406', '789']
      }
    ]
  }
}))
