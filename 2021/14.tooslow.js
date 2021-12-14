const { lines } = require('../lib')

const template = lines[0].split('')
const insertions = lines.slice(1)
  .reduce((mapping, line) => {
    const [, match, insert] = line.match(/([A-Z][A-Z]) -> ([A-Z])/)
    mapping[match] = insert
    return mapping
  }, {})

// Build a pipeline of insert / count nodes

function insert (element) {
  const insertedElement = insertions[this.lastElement + element]
  if (insertedElement) {
    this.next(insertedElement)
  }
  this.next(element)
  this.lastElement = element
}

function count (element) {
  if (this[element] === undefined) {
    this[element] = 0
  }
  ++this[element]
  if (this.next) {
    this.next(element)
  }
}

const scopes = []
const steps = []
const count10 = {}
const count40 = {}
for (let index = 0; index < 40; ++index) {
  scopes[index] = {}
  steps[index] = insert.bind(scopes[index])
}
const STEPS = 40
for (let index = 0; index < STEPS; ++index) {
  if (index === 9) {
    count10.next = steps[10]
    scopes[index].next = count.bind(count10)
  } else {
    scopes[index].next = steps[index + 1]
  }
}
scopes[STEPS - 1].next = count.bind(count40)

function diff (count) {
  const elements = Object.keys(count)
    .filter(name => name !== 'next')
    .sort((element1, element2) => count[element2] - count[element1])
  const mostCommon = elements.shift()
  const leastCommon = elements.pop()
  return count[mostCommon] - count[leastCommon]
}

template.forEach((element, index) => {
  console.log(`${index.toString().padStart(2, '0')}/${template.length}: ${element}`)
  steps[0](element)
})
console.log('Step 1 :', diff(count10), count10)
console.log('Step 2 :', diff(count40), count40)
