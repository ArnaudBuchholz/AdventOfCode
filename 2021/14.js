const { lines } = require('../lib')

const template = lines[0].split('')
const insertions = lines.slice(1)
  .reduce((mapping, line) => {
    const [, match, insert] = line.match(/([A-Z][A-Z]) -> ([A-Z])/)
    mapping[match] = insert
    return mapping
  }, {})

const inc = (dictionary, key, count) => {
  if (dictionary[key] === undefined) {
    dictionary[key] = 0
  }
  dictionary[key] += count
}

const state = {
  init () {
    this.pairs = {}
    template.slice(1).forEach((element, index) => inc(this.pairs, template[index] + element, 1))
    this.pairs[template.slice(-1) + ' '] = 1
  },

  counts () {
    const counts = {}
    Object.keys(this.pairs)
      .forEach(key => {
        const count = this.pairs[key]
        const [element1] = key.split('')
        inc(counts, element1, count)
      })
    return counts
  },

  diff () {
    const counts = this.counts()
    const sorted = Object.keys(counts)
      .sort((element1, element2) => counts[element2] - counts[element1])
    const mostCommon = sorted.shift()
    const leastCommon = sorted.pop()
    return counts[mostCommon] - counts[leastCommon]
  },

  step () {
    const nextPairs = {}
    Object.keys(this.pairs)
      .forEach(key => {
        const insertion = insertions[key]
        const count = this.pairs[key]
        if (insertion) {
          const [element1, element2] = key.split('')
          inc(nextPairs, element1 + insertion, count)
          inc(nextPairs, insertion + element2, count)
        } else {
          inc(nextPairs, key, count)
        }
      })
    this.pairs = nextPairs
  }
}

state.init()

for (let index = 0; index < 40; ++index) {
  if (index === 10) {
    console.log('Step 1 :', state.diff())
  }
  state.step()
}
console.log('Step 2 :', state.diff())
