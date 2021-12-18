const assert = require('assert')
const { lines } = require('../lib')
const [ xmin, xmax, ymin, ymax ] = lines[0]
  .match(/x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/)
  .slice(1).map(Number)

console.log('Target : x=', xmin, '..', xmax, ', y=', ymin, '..', ymax)

function coord (initialSpeed, t) {
  let position = 0
  while (t > 0) {
    position += initialSpeed
    --initialSpeed
    --t
  }
  return position
}

function solve (name, min, max) {
  let solutions = {}
  let count = 0
  let initialSpeed
  let minSpeed
  if (name === 'x') {
    initialSpeed = xmax
    minSpeed = 0
  } else {
    initialSpeed = Math.max(Math.abs(min), Math.abs(max))
    minSpeed = Math.min(min, max) - 1
  }
  while (initialSpeed > minSpeed) {
    let speed = initialSpeed
    let t = 0
    let c = 0 // coordinate
    while (speed > minSpeed) {
      ++t
      c += speed
      --speed
      if ((min <= c) && (c <= max)) {
        if (solutions[t] === undefined) {
          solutions[t] = []
        }
        solutions[t].push(initialSpeed)
        ++count
        console.log(`Initial ${name} speed :`, initialSpeed, 't :', t, '->', c)
      }
    }
    --initialSpeed
    if (0 === initialSpeed) {
      --initialSpeed
    }
  }
  return { solutions, count }
}

const { solutions: xSolutions, count: xSolutionsCount } = solve('x', xmin, xmax)
console.log('Solutions count for x :', xSolutionsCount)
const { solutions: ySolutions, count: ySolutionsCount } = solve('y', ymin, ymax)
console.log('Solutions count for y :', ySolutionsCount)

let maxYSpeed = 0
let tForMaxYSpeed = 0
Object.keys(ySolutions).forEach(t => {
  const maxSpeedForT = ySolutions[t].reduce((max, speed) => Math.max(max, speed), 0)
  if (maxSpeedForT > maxYSpeed) {
    maxYSpeed = maxSpeedForT
    tForMaxYSpeed = t
  }
})

console.log('Max y speed :', maxYSpeed, '(t=', tForMaxYSpeed, ')')

let y = 0
while (maxYSpeed > 0) {
  y += maxYSpeed
  --maxYSpeed
}

console.log('Step 1 :', y)

// This number represents the max T under which we MUST validate if solutions exist
let maxTForX = Object.keys(xSolutions).map(Number).reduce((max, tx) => Math.max(max, tx), 0)
console.log('Max t for x :', maxTForX)

let nbSolutions = 0
Object.keys(ySolutions).map(Number).forEach(ty => {
  const nbYSolutions = ySolutions[ty].length
  let nbXSolutions = 0
  if (ty >= maxTForX) {
    nbXSolutions = 1
  } else {
    // pick X solutions where t <= ty
    nbXSolutions = Object.keys(xSolutions).map(Number).filter(tx => tx === ty).reduce((total, tx) => total += xSolutions[tx].length, 0)
  }
  console.log('ty :', ty, ' => ', nbYSolutions, 'x', nbXSolutions)
  nbSolutions += nbYSolutions * nbXSolutions
})

console.log('Step 2 :', nbSolutions)
