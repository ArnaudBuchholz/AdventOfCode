const { buildTests } = require('./tests-builder')
const {
  gcd
} = require('./math')

describe('math', () => {
  buildTests({
    gcd: {
      method: gcd,
      tests: [
        { i: [2, 3], o: 1 },
        { i: [2, 6, 8], o: 2 }
      ]
    }
  })()
})
