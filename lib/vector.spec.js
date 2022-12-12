const { buildTests } = require('./tests-builder')
const {
  encode,
  decode
} = require('./vector')

describe('vector', buildTests({
  encode: {
    method: encode,
    tests: [
      { i: [[1, 2]], o: '1,2' },
      { i: [[1, 2, -1]], o: '1,2,-1' }
    ]
  },
  decode: {
    method: decode,
    tests: [
      { i: ['1,2'], o: [1, 2] },
      { i: ['1,2,-1'], o: [1, 2, -1] }
    ]
  }
}))
