const isSample = process.argv.includes('-sample')
const verbose = process.argv.includes('-verbose')
const { lines } = require('../lib')
const [xmin, xmax, ymin, ymax] = lines[0]
  .match(/x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/)
  .slice(1).map(Number)

console.log('Target : x=', xmin, '..', xmax, ', y=', ymin, '..', ymax)

function solve (name, min, max) {
  const solutions = []
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
    let c = 0 // coordinate
    while (speed > minSpeed) {
      c += speed
      --speed
      if ((min <= c) && (c <= max)) {
        if (!solutions.includes(initialSpeed)) {
          solutions.push(initialSpeed)
        }
      }
    }
    --initialSpeed
  }
  return solutions
}

const solutionsX = solve('x', xmin, xmax)
console.log('Solutions count for x :', solutionsX.length)
if (verbose || isSample) {
  console.log(solutionsX.sort((a, b) => a - b))
}
const solutionsY = solve('y', ymin, ymax)
console.log('Solutions count for y :', solutionsY.length)
if (verbose || isSample) {
  console.log(solutionsY.sort((a, b) => a - b))
}

let maxYSpeed = solutionsY.sort((a, b) => b - a)[0]
console.log('Max y speed :', maxYSpeed)

let highestY = 0
while (maxYSpeed > 0) {
  highestY += maxYSpeed--
}
console.log('Step 1 :', highestY)

function sort ([vx1, vy1], [vx2, vy2]) {
  if (vx1 === vx2) {
    return vy1 - vy2
  }
  return vx1 - vx2
}

if (isSample) {
  const sampleSolutionsTxt = `23,-10  25,-9   27,-5   29,-6   22,-6   21,-7   9,0     27,-7   24,-5
25,-7   26,-6   25,-5   6,8     11,-2   20,-5   29,-10  6,3     28,-7
8,0     30,-6   29,-8   20,-10  6,7     6,4     6,1     14,-4   21,-6
26,-10  7,-1    7,7     8,-1    21,-9   6,2     20,-7   30,-10  14,-3
20,-8   13,-2   7,3     28,-8   29,-9   15,-3   22,-5   26,-8   25,-8
25,-6   15,-4   9,-2    15,-2   12,-2   28,-9   12,-3   24,-6   23,-7
25,-10  7,8     11,-3   26,-7   7,1     23,-9   6,0     22,-10  27,-6
8,1     22,-8   13,-4   7,6     28,-6   11,-4   12,-4   26,-9   7,4
24,-10  23,-8   30,-8   7,0     9,-1    10,-1   26,-5   22,-9   6,5
7,5     23,-6   28,-10  10,-2   11,-1   20,-9   14,-2   29,-7   13,-3
23,-5   24,-8   27,-9   30,-7   28,-5   21,-10  7,9     6,6     21,-5
27,-10  7,2     30,-9   21,-8   22,-7   24,-9   20,-6   6,9     29,-5
8,-2    27,-8   30,-5   24,-7`

  const sampleSolutionsX = []
  const sampleSolutionsY = []
  const sampleSolutions = []
  sampleSolutionsTxt.replace(/(\d+),(-?\d+)/g, (_, strx, stry) => {
    const vx = Number(strx)
    const vy = Number(stry)
    if (!sampleSolutionsX.includes(vx)) {
      sampleSolutionsX.push(vx)
    }
    if (!sampleSolutionsY.includes(vy)) {
      sampleSolutionsY.push(vy)
    }
    sampleSolutions.push([vx, vy])
  })
  console.log('Sample solutions count for x :', sampleSolutionsX.length)
  console.log(sampleSolutionsX.sort((a, b) => a - b))
  console.log('Sample solutions count for y :', sampleSolutionsY.length)
  console.log(sampleSolutionsY.sort((a, b) => a - b))
  console.log('Sample solutions :', sampleSolutions.length)
  console.dir(sampleSolutions.sort(sort), { maxArrayLength: null })
}

function xCoord (xSpeed, t) {
  let x = 0
  while (t-- > 0) {
    x += Math.max(xSpeed--, 0)
  }
  return x
}

const solutions = []
solutionsY.forEach(vy => {
  let ySpeed = vy
  let y = 0
  let ty = 0
  while (y >= ymin) {
    if ((ymin <= y) && (y <= ymax)) {
      solutionsX.forEach(vx => {
        const x = xCoord(vx, ty)
        if ((xmin <= x) && (x <= xmax)) {
          if (!solutions.some(([cx, cy]) => cx === vx && cy === vy)) {
            solutions.push([vx, vy])
          }
          if (verbose) {
            console.log('[', vx, ',', vy, '] -> (', x, ',', y, ')')
          }
        }
      })
    }
    y += ySpeed--
    ++ty
  }
})

console.log('Step 2 :', solutions.length)
if (verbose || isSample) {
  console.dir(solutions.sort(sort), { maxArrayLength: null })
}
