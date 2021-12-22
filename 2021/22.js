const { lines } = require('../lib')
const verbose = process.argv.includes('-verbose')

const min = -50
const max = 50
const length = (max - min + 1)
const bufferSize = length * length * length
if (verbose) {
  console.log('Buffer size :', bufferSize)
}
const buffer = new Int8Array(bufferSize)
buffer.fill(0)
let count = 0

let globalZMin = 0
let globalZMax = 0
let globalYMin = 0
let globalYMax = 0
let globalXMin = 0
let globalXMax = 0

lines.forEach(line => {
  const match = line.match(/(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/)
  const on = match[1] === 'on'
  const [xmin, xmax, ymin, ymax, zmin, zmax] = [].slice.call(match,2).map(Number)
  if (verbose) {
    console.log(on ? 'on' : 'off', 'x=', xmin, '..', xmax, ' y=', ymin, '..', ymax, ' z=', zmin, '..', zmax, ' ')
  }

  globalXMin = Math.min(xmin, globalXMin)
  globalXMax = Math.max(xmax, globalXMax)
  globalYMin = Math.min(ymin, globalYMin)
  globalYMax = Math.max(ymax, globalYMax)
  globalZMin = Math.min(zmin, globalZMin)
  globalZMax = Math.max(zmax, globalZMax)

  for (let z = Math.max(zmin, min); z <= Math.min(zmax, max); ++z) {
    const zOffset = length * length * (z - min)

    for (let y = Math.max(ymin, min); y <= Math.min(ymax, max); ++y) {
      const rowOffset = zOffset + length * (y - min)

      for (let x = Math.max(xmin, min); x <= Math.min(xmax, max); ++x) {
        const offset = rowOffset + x - min
        if (on && buffer[offset] === 0) {
          buffer[offset] = 1
          ++count
        }
        if (!on && buffer[offset] === 1) {
          buffer[offset] = 0
          --count
        }
      }
    }
  }
})

console.log('Step 1 :', count)

const rangeX = globalXMax - globalXMin + 1
const rangeY = globalYMax - globalYMin + 1
const rangeZ = globalZMax - globalZMin + 1

const rangeBufferSize = rangeZ * rangeY * rangeX

if (verbose) {
  console.log('x :', globalXMin, '..', globalXMax, ' ', rangeX)
  console.log('y :', globalYMin, '..', globalYMax, ' ', rangeY)
  console.log('z :', globalZMin, '..', globalZMax, ' ', rangeZ)
  console.log('Range buffer size :', rangeBufferSize)
}

const xIndexes = []
const yIndexes = []
const zIndexes = []

lines.forEach(line => {
  const match = line.match(/(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/)
  const on = match[1] === 'on'
  const [xmin, xmax, ymin, ymax, zmin, zmax] = [].slice.call(match,2).map(Number)
  if (verbose) {
    console.log(on ? 'on' : 'off', 'x=', xmin, '..', xmax, ' y=', ymin, '..', ymax, ' z=', zmin, '..', zmax, ' ')
  }

  for (let z = zmin; z <= zmax; ++z) {
    if (!zIndexes.includes(z)) {
      zIndexes.push(z)
    }
  }

  for (let y = ymin; y <= ymax; ++y) {
    if (!yIndexes.includes(y)) {
      yIndexes.push(y)
    }
  }

  for (let x = xmin; x <= xmax; ++x) {
    if (!xIndexes.includes(x)) {
      xIndexes.push(x)
    }
  }
})

const indexBufferSize = xIndexes.length * yIndexes.length * zIndexes.length

if (verbose) {
  console.log('x indexes :', xIndexes.length)
  console.log('y indexes :', yIndexes.length)
  console.log('z indexes :', zIndexes.length)
  console.log('Index buffer size :', indexBufferSize)
}

const pageBufferSize = xIndexes.length * yIndexes.length
const pageBuffers = zIndexes.map(_ => new Int8Array(pageBufferSize))
  