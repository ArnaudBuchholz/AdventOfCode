const { lines } = require('../lib')
const verbose = process.argv.includes('-verbose')

const steps = lines.map(line => {
  const match = line.match(/(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/)
  const on = match[1] === 'on'
  const [xmin, xmax, ymin, ymax, zmin, zmax] = [].slice.call(match, 2).map(Number)
  if (verbose) {
    console.log(on ? 'on' : 'off', 'x=', xmin, '..', xmax, ' y=', ymin, '..', ymax, ' z=', zmin, '..', zmax)
  }
  return { on, xmin, xmax, ymin, ymax, zmin, zmax }
})

const min = -50
const max = 50
const length = (max - min + 1)
const bufferSize = length * length * length
if (verbose) {
  console.log('Buffer size :', bufferSize)
}
const buffer = new Int8Array(bufferSize)
buffer.fill(0)
let step1Count = 0

steps.forEach(({ on, xmin, xmax, ymin, ymax, zmin, zmax }) => {
  for (let z = Math.max(zmin, min); z <= Math.min(zmax, max); ++z) {
    const zOffset = length * length * (z - min)

    for (let y = Math.max(ymin, min); y <= Math.min(ymax, max); ++y) {
      const rowOffset = zOffset + length * (y - min)

      for (let x = Math.max(xmin, min); x <= Math.min(xmax, max); ++x) {
        const offset = rowOffset + x - min
        if (on && buffer[offset] === 0) {
          buffer[offset] = 1
          ++step1Count
        }
        if (!on && buffer[offset] === 1) {
          buffer[offset] = 0
          --step1Count
        }
      }
    }
  }
})

console.log('Step 1 :', step1Count)

const xAxis = []
const yAxis = []
const zAxis = []

steps.forEach(({ xmin, xmax, ymin, ymax, zmin, zmax }) => {
  if (!xAxis.includes(xmin)) {
    xAxis.push(xmin)
  }
  if (!xAxis.includes(xmax)) {
    xAxis.push(xmax)
  }
  if (!yAxis.includes(ymin)) {
    yAxis.push(ymin)
  }
  if (!yAxis.includes(ymax)) {
    yAxis.push(ymax)
  }
  if (!zAxis.includes(zmin)) {
    zAxis.push(zmin)
  }
  if (!zAxis.includes(zmax)) {
    zAxis.push(zmax)
  }
})

xAxis.sort((a, b) => a - b)
yAxis.sort((a, b) => a - b)
zAxis.sort((a, b) => a - b)
const cubesBufferSize = (xAxis.length - 1) * (yAxis.length - 1) * (zAxis.length - 1)

if (verbose) {
  console.log('X axis :', xAxis)
  console.log('Y axis :', yAxis)
  console.log('Z axis :', zAxis)
  console.log('Cubes buffer size :', cubesBufferSize)
}

const cubesBuffer = new Int8Array(cubesBufferSize)
cubesBuffer.fill(0)

function volume (x, y, z) {
  const xmin = xAxis[x]
  const xmax = xAxis[x + 1]
  const ymin = yAxis[y]
  const ymax = yAxis[y + 1]
  const zmin = zAxis[z]
  const zmax = zAxis[z + 1]
  return (xmax - xmin + 1) * (ymax - ymin + 1) * (zmax - zmin + 1)
}

let step2Count = 0

steps.forEach(({ on, xmin, xmax, ymin, ymax, zmin, zmax }) => {
  const cubeXmin = xAxis.indexOf(xmin)
  const cubeXmax = xAxis.indexOf(xmax)
  const cubeYmin = yAxis.indexOf(ymin)
  const cubeYmax = yAxis.indexOf(ymax)
  const cubeZmin = zAxis.indexOf(zmin)
  const cubeZmax = zAxis.indexOf(zmax)

  if (verbose) {
    console.log(on ? 'on' : 'off', 'x=', xmin, '(', cubeXmin, ')', '..', xmax, '(', cubeXmax, ')',
      ' y=', ymin, '(', cubeYmin, ')', '..', ymax, '(', cubeYmax, ')',
      ' z=', zmin, '(', cubeZmin, ')', '..', zmax, '(', cubeZmax, ')')
  }

  for (let z = cubeZmin; z < cubeZmax; ++z) {
    const zOffset = (xAxis.length - 1) * (yAxis.length - 1) * z

    for (let y = cubeYmin; y < cubeYmax; ++y) {
      const rowOffset = zOffset + (xAxis.length - 1) * y

      for (let x = cubeXmin; x < cubeXmax; ++x) {
        const offset = rowOffset + x
        if (on && cubesBuffer[offset] === 0) {
          cubesBuffer[offset] = 1
          step2Count += volume(x, y, z)
        }
        if (!on && cubesBuffer[offset] === 1) {
          cubesBuffer[offset] = 0
          step2Count -= volume(x, y, z)
        }
      }
    }
  }
})

console.log('Step 2 :', step2Count)
