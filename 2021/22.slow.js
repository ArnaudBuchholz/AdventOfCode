const { lines } = require('../lib')
const verbose = process.argv.includes('-verbose')
const cap50 = process.argv.includes('-50')

const steps = lines
  .filter(line => !line.startsWith('#'))
  .map(line => {
    const match = line.match(/(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/)
    const on = match[1] === 'on'
    let [xmin, xmax, ymin, ymax, zmin, zmax] = [].slice.call(match, 2).map(Number)
    if (cap50) {
      xmin = Math.max(xmin, -50)
      xmax = Math.min(xmax, 50)
      if (xmax < xmin) {
        return 0
      }
      ymin = Math.max(ymin, -50)
      ymax = Math.min(ymax, 50)
      if (ymax < ymin) {
        return 0
      }
      zmin = Math.max(zmin, -50)
      zmax = Math.min(zmax, 50)
      if (zmax < zmin) {
        return 0
      }
    }
    if (verbose) {
      console.log(on ? 'on' : 'off', 'x=', xmin, '..', xmax, ' y=', ymin, '..', ymax, ' z=', zmin, '..', zmax)
    }
    return { on, xmin, xmax, ymin, ymax, zmin, zmax }
  })
  .filter(line => !!line)

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

let xAxis = []
let yAxis = []
let zAxis = []

steps.forEach(({ xmin, xmax, ymin, ymax, zmin, zmax }) => {
  xAxis.push(xmin - 1, xmin, xmin + 1)
  xAxis.push(xmax - 1, xmax, xmax + 1)
  yAxis.push(ymin - 1, ymin, ymin + 1)
  yAxis.push(ymax - 1, ymax, ymax + 1)
  zAxis.push(zmin - 1, zmin, zmin + 1)
  zAxis.push(zmax - 1, zmax, zmax + 1)
})

function unique (array, value) {
  if (array.includes(value)) {
    return array
  }
  array.push(value)
  return array
}

xAxis = xAxis.reduce(unique, []).sort((a, b) => a - b).slice(1, -1)
yAxis = yAxis.reduce(unique, []).sort((a, b) => a - b).slice(1, -1)
zAxis = zAxis.reduce(unique, []).sort((a, b) => a - b).slice(1, -1)
const xAxisBitLength = Math.ceil(xAxis.length / 8)
const cubesBufferSize = xAxisBitLength * yAxis.length * zAxis.length

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
  const xmax = xAxis[x + 1] ?? (xmin + 1)
  const ymin = yAxis[y]
  const ymax = yAxis[y + 1] ?? (ymin + 1)
  const zmin = zAxis[z]
  const zmax = zAxis[z + 1] ?? (zmin + 1)
  const result = (xmax - xmin) * (ymax - ymin) * (zmax - zmin)
  return result
}

function cubeOffsetAndMask (x, y, z) {
  const zOffset = xAxisBitLength * yAxis.length * z
  const rowOffset = zOffset + xAxisBitLength * y
  const offset = rowOffset + Math.floor(x / 8)
  const mask = 2 ** (x % 8)
  return { offset, mask }
}

if (verbose) {
  console.log('Setting on & off...')
}

steps.forEach(({ on, xmin, xmax, ymin, ymax, zmin, zmax }, stepIndex) => {
  const cubeXmin = xAxis.indexOf(xmin)
  const cubeXmax = xAxis.indexOf(xmax)
  const cubeYmin = yAxis.indexOf(ymin)
  const cubeYmax = yAxis.indexOf(ymax)
  const cubeZmin = zAxis.indexOf(zmin)
  const cubeZmax = zAxis.indexOf(zmax)

  if (verbose) {
    console.log(stepIndex.toString().padStart(4, ' '), on ? 'on' : 'off',
      ' x=', xmin, '(', cubeXmin, ')', '..', xmax, '(', cubeXmax, ')',
      ' y=', ymin, '(', cubeYmin, ')', '..', ymax, '(', cubeYmax, ')',
      ' z=', zmin, '(', cubeZmin, ')', '..', zmax, '(', cubeZmax, ')')
  }

  for (let z = cubeZmin; z <= cubeZmax; ++z) {
    for (let y = cubeYmin; y <= cubeYmax; ++y) {
      for (let x = cubeXmin; x <= cubeXmax; ++x) {
        const { offset, mask } = cubeOffsetAndMask(x, y, z)
        if (on) {
          cubesBuffer[offset] |= mask
        } else {
          cubesBuffer[offset] &= ~mask
        }
      }
    }
  }
})

if (verbose) {
  console.log('Counting...')
}

let step2Count = 0
let start = new Date()

zAxis.forEach((zMin, cubeZmin) => {
  yAxis.forEach((yMin, cubeYmin) => {
    xAxis.forEach((xMin, cubeXmin) => {
      const now = new Date()
      if (verbose && (now - start) > 5000) {
        console.log(Math.floor(cubeZmin * 100 / zAxis.length), '%', step2Count)
        start = now
      }

      const { offset, mask } = cubeOffsetAndMask(cubeXmin, cubeYmin, cubeZmin)
      if ((cubesBuffer[offset] & mask) === mask) {
        step2Count += volume(cubeXmin, cubeYmin, cubeZmin)
      }
    })
  })
})

console.log('Step 2 :', step2Count)
if (verbose && cap50) {
  console.log(step1Count !== step2Count ? 'KO' : 'OK')
}