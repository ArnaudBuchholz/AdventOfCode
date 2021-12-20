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
      scanners.push({
        index: scanners.length,
        location: 0,
        rotation: 0,
        detected: []
      })
    } else {
      const [, x, y, z] = line.match(/(-?\d+),(-?\d+),(-?\d+)/).map(Number)
      scanners[scanners.length - 1].detected.push({ x, y, z })
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

const allBeacons = [...scanners[0].detected]
scanners.shift()

function addBeacon ({ x, y, z }) {
  if (!allBeacons.some(({ ax, ay, az }) => (ax === x) && (ay === y) && (az === z))) {
    allBeacons.push({ x, y, z })
  }
}

let scannerLocated = 0
while (scannerLocated < scanners.length) {
  const lastScannerLocated = scannerLocated

  scanners.forEach((scanner, indexOfScanner) => {
    if (scanner.location) {
      return true
    }

    if (verbose) {
      console.log('Scanner', indexOfScanner + 1)
    }

    rotations.every(rotation => {
      const rotatedBeacons = scanner.detected.map(({ x, y, z }) => {
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

      return !allBeacons.some(({ x: ax, y: ay, z: az }) => {
        // Assuming offset is constent, pick the first dot and compute it
        const { x: rx, y: ry, z: rz } = rotatedBeacons[0]
        const offsetX = ax - rx
        const offsetY = ay - ry
        const offsetZ = az - rz

        const translatedAndRotatedBeacons = rotatedBeacons.map(({ x: rx, y: ry, z: rz }) => {
          return {
            x: rx + offsetX,
            y: ry + offsetY,
            z: rz + offsetZ
          }
        })

        const matching = translatedAndRotatedBeacons.filter(({ x, y, z }) => {
          return allBeacons.some(({ x: ax, y: ay, z: az }) => {
            return ax === x && ay === y && az === z
          })
        })

        if (matching.length >= 12) {
          scanner.rotation = rotation
          scanner.location = { offsetX, offsetY, offsetZ }
          console.log(scanner.index, scanner.rotation, scanner.location, matching.length)
          translatedAndRotatedBeacons.forEach(coords => addBeacon(coords))
          allBeacons.sort(order)
          ++scannerLocated
          return true
        } else {
          if (verbose) {
            console.log(scanner.index, rotation, { offsetX, offsetY, offsetZ }, matching.length)
          }
          return false
        }
      })
    })
  })

  if (lastScannerLocated === scannerLocated) {
    console.error('loop without new location, breaking')
    break
  }
}

console.log('Step 1 :', allBeacons.length)
if (verbose) {
  console.log(allBeacons)
}
