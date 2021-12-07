const input = require('./input')

const positions = input.split('\n')[0].split(',').map(n => parseInt(n, 10))

const { min, max } = positions.reduce(({ min, max }, position) => {
  min = Math.min(position, min)
  max = Math.max(position, max)
  return { min, max }
}, { min: Number.MAX_SAFE_INTEGER, max: 0 })
console.log('Positions :', positions.length, '[', min, ' - ', max, ']')

let optimalPosition
let optimalFuel = Number.MAX_SAFE_INTEGER

for (let proposal = min; proposal <= max; ++proposal) {
  let fuel = positions.reduce((total, position) => total + Math.abs(position - proposal), 0)
  if (fuel < optimalFuel) {
    optimalPosition = proposal
    optimalFuel = fuel
  }
}
console.log('Part 1', optimalPosition, optimalFuel)

optimalFuel = Number.MAX_SAFE_INTEGER // reset

function cost (steps) {
  if (cost.memorized[steps] !== undefined) {
    return cost.memorized[steps]
  }
  const result = steps + cost(steps - 1)
  cost.memorized[steps] = result
  return result
}
cost.memorized = [0, 1]

for (let proposal = min; proposal <= max; ++proposal) {
  let fuel = positions.reduce((total, position) => total + cost(Math.abs(position - proposal)), 0)
  if (fuel < optimalFuel) {
    optimalPosition = proposal
    optimalFuel = fuel
  }
}
console.log('Part 2', optimalPosition, optimalFuel)
