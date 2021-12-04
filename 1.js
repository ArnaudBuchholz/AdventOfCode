const input = require('./input')
const depths = input.split('\n').map(value => parseInt(value, 10))

function getIncreaseCount (array) {
  const { count } = array.reduce(({ last, count }, depth) => {
    if (last && depth > last) {
      ++count
    }
    return { last: depth, count }
  }, { count: 0 })
  return count
}

console.log('Part 1 :', getIncreaseCount(depths))

const windows = depths.slice(0, -2).map((depth, index) => {
  return depth + depths[index + 1] + depths[index + 2]
})

console.log('Part 2 :', getIncreaseCount(windows))
