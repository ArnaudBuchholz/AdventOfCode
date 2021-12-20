const assert = require('assert')
const { lines } = require('../lib')
const verbose = process.argv.includes('-verbose')

// https://www.euclideanspace.com/maths/algebra/matrix/transforms/examples/index.htm
const rotationMatrixes = `
1 0 0
0 1 0
0 0 1

0 0 1
0 1 0
-1 0 0

-1 0 0
0 1 0
0 0 -1

0 0 -1
0 1 0
1 0 0

0 -1 0
1 0 0
0 0 1

0 0 1
1 0 0
0 1 0

0 1 0
1 0 0
0 0 -1

0 0 -1
1 0 0
0 -1 0

0 1 0
-1 0 0
0 0 1

0 0 1
-1 0 0
0 -1 0

0 -1 0
-1 0 0
0 0 -1

0 0 -1
-1 0 0
0 1 0

1 0 0
0 0 -1
0 1 0

0 1 0
0 0 -1
-1 0 0

-1 0 0
0 0 -1
0 -1 0

0 -1 0
0 0 -1
1 0 0

1 0 0
0 -1 0
0 0 -1

0 0 -1
0 -1 0
-1 0 0

-1 0 0
0 -1 0
0 0 1

0 0 1
0 -1 0
1 0 0

1 0 0
0 0 1
0 -1 0

0 -1 0
0 0 1
-1 0 0

-1 0 0
0 0 1
0 1 0

0 1 0
0 0 1
1 0 0
`

const rotations = []

rotationMatrixes.replace(/(-?\d)\s*(-?\d)\s*(-?\d)\n(-?\d)\s*(-?\d)\s*(-?\d)\n(-?\d)\s*(-?\d)\s*(-?\d)/g, (...match) => {
  const coords = [0, 0, 0]
  coords.forEach((_, index) => {
    if (match[3 * index + 1] === '1') {
      coords[index] = 'x'
    } else if (match[3 * index + 1] === '-1') {
      coords[index] = '-x'
    } else if (match[3 * index + 2] === '1') {
      coords[index] = 'y'
    } else if (match[3 * index + 2] === '-1') {
      coords[index] = '-y'
    } else if (match[3 * index + 3] === '1') {
      coords[index] = 'z'
    } else if (match[3 * index + 3] === '-1') {
      coords[index] = '-z'
    }
  })
  const rotation = coords.join(',')
  if (verbose) {
    console.log(rotation, '\n', match[0])
  }
  assert.strictEqual(rotations.includes(rotation), false)
  rotations.push(rotation)
})

assert.strictEqual(rotations.length, 24)

const scanners = []
lines
  .filter(line => !!line)
  .forEach(line => {
    if (line.startsWith('---')) {
      scanners.push([])
    } else {
      const [, x, y, z] = line.match(/(-?\d+),(-?\d+),(-?\d+)/).map(Number)
      scanners[scanners.length - 1].push({ x, y, z })
    }
  })

// console.log(scanners)

function order ({ x1, y1, z1 }, { x2, y2, z2 }) {
  if (z2 !== z1) {
    return z2 - z1
  }
  if (y2 !== y1) {
    return y2 - y1
  }
  return x2 - x1
}

// const beacons = [ ...scanners[0] ]

scanners.every((scannerA, indexOfA) => {
  const beaconsA = [...scannerA].sort(order)

  scanners.every((scannerB, indexOfB) => {
    if (indexOfA === indexOfB) {
      return true // next
    }

    if (verbose) {
      console.log('Scanner', indexOfA, '<-> Scanner', indexOfB)
    }

    rotations.every(rotation => {
      const beaconsB = scannerB.map(({ x, y, z }) => {
        const coords = {
          x: x,
          '-x': -x,
          y: y,
          '-y': -y,
          z: z,
          '-z': -z
        }
        const rotated = []
        rotation.split(',').forEach((r, ri) => {
          rotated[ri] = coords[r]
        })
        return { x: rotated[0], y: rotated[1], z: rotated[2] }
      }).sort(order)

      const found = !beaconsA.every(({ x: rax, y: ray, z: raz }) => {
        // Assuming offset is constent, pick the first dot and compute it
        const { x: rbx, y: rby, z: rbz } = beaconsB[0]
        const offsetX = rax - rbx
        const offsetY = ray - rby
        const offsetZ = raz - rbz

        const matching = beaconsB.filter(({ x: bx, y: by, z: bz }) => {
          bx += offsetX
          by += offsetY
          bz += offsetZ
          return beaconsA.some(({ x: ax, y: ay, z: az }) => {
            return ax === bx && ay === by && az === bz
          })
        })
        if (matching.length >= 12) {
          console.log(indexOfA, indexOfB, rotation, { offsetX, offsetY, offsetZ }, matching.length)
          scanners[indexOfB] = beaconsB.map(({ x, y, z }) => {
            return {
              x: x + offsetX,
              y: y + offsetY,
              z: z + offsetZ
            }
          })
          return false
        }
        if (verbose) {
          console.log('\t', rotation, { offsetX, offsetY, offsetZ }, matching.length)
        }
        return true
      })

      return !found
    })

    return true
  })

  return true
})
