const { buildTests } = require('./tests-builder')
const {
  contains,
  overlaps
} = require('./range')

describe('range', buildTests({
  contains: {
    method: contains,
    tests: [
      { i: [[1, 2], [3, 4]], o: null },
      { i: [[1, 2], [1, 2]], o: [1, 2] },
      { i: [[1, 5], [3, 4]], o: [3, 4] },
      { i: [[3, 4], [1, 5]], o: [3, 4] },
      { i: [[5, 6], [6, 10]], o: null }
    ]
  },
  overlaps: {
    method: overlaps,
    tests: [
      { i: [[1, 2], [3, 4]], o: null },
      { i: [[1, 2], [1, 2]], o: [1, 2] },
      { i: [[1, 5], [3, 4]], o: [3, 4] },
      { i: [[1, 5], [3, 3]], o: [3, 3] },
      { i: [[1, 5], [3, 6]], o: [3, 5] },
      { i: [[1, 5], [-1, 20]], o: [1, 5] },
      { i: [[3, 4], [1, 5]], o: [3, 4] },
      { i: [[5, 6], [6, 10]], o: [6, 6] },
      { i: [[5, 10], [6, 11]], o: [6, 10] }
    ]
  }
}))
