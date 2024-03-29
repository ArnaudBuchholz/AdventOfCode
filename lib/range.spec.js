const { buildTests } = require('./tests-builder')
const {
  getContained,
  getIntersection,
  empty,
  extend,
  isInside
} = require('./range')

describe('range', () => {
  buildTests({
    getContained: {
      method: getContained,
      tests: [
        { i: [[1, 2], [3, 4]], o: null },
        { i: [[1, 2], [1, 2]], o: [1, 2] },
        { i: [[1, 5], [3, 4]], o: [3, 4] },
        { i: [[3, 4], [1, 5]], o: [3, 4] },
        { i: [[5, 6], [6, 10]], o: null }
      ]
    },
    getIntersection: {
      method: getIntersection,
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
    },
    isInside: {
      method: isInside,
      tests: [
        { i: [empty(), 0], o: false },
        { i: [empty(), -1], o: false },
        { i: [empty(), 1], o: false },
        { i: [empty(), Infinity], o: false },
        { i: [empty(), -Infinity], o: false },
        { i: [[1, 2], 1], o: true },
        { i: [[1, 2], 2], o: true },
        { i: [[1, 2], 0], o: false },
        { i: [[1, 2], 3], o: false }
      ]
    }
  })()

  describe('building', () => {
    it('enables building range from values', () => {
      const initial = empty()
      const first = extend(initial, 2)
      expect(first).toStrictEqual([2, 2])
      const second = extend(first, 5)
      expect(second).toStrictEqual([2, 5])
      expect(extend(second, -1)).toStrictEqual([-1, 5])
      expect(extend(second, 3)).toStrictEqual([2, 5])
      expect(extend(second, 10)).toStrictEqual([2, 10])
    })
  })
})
