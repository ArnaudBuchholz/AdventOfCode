const { buildTests } = require('./tests-builder')
const {
  shortest
} = require('./graph')

describe('graph', () => {
  // https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNpl0DsOwyAMBuCrRJ6TCzB06g26sjhgHlEgEYWhinL30jqVLJWJT_xGtg8wmyVQ4AvuQeehHxym6TZYiSgxM-YvDMPIGiNjVsYYKEESjkH_uL52sobhGV7WMK55goxF2QFjYSy_SXWGERKVhNH2zRyfZw01UCINql8tOWxr1aDz2aPY6vZ4ZQOqlkYjtN1ipXvEvtMEyuH6pPMNLW9c_Q
  const nodes = {
    a: ['d', 'i', 'b'],
    b: ['c'],
    c: ['d', 'b'],
    d: ['c', 'a', 'e', 'f'],
    e: ['f', 'd'],
    f: ['e', 'g'],
    g: ['f', 'h'],
    h: ['g'],
    i: ['a', 'j'],
    j: ['i']
  }

  const getConnections = node => nodes[node]

  buildTests({
    shortest: {
      method: shortest,
      tests: [
        { i: ['a', 'b', getConnections], o: ['a', 'b'] },
        { i: ['b', 'a', getConnections], o: ['b', 'c', 'd', 'a'] },
        { i: ['d', 'h', getConnections], o: ['d', 'f', 'g', 'h'] }
      ]
    }
  })()
})
