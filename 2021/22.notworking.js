const { lines } = require('../lib')
const verbose = process.argv.includes('-verbose')

const steps = lines
  .filter(line => !line.startsWith('#'))
  .map(line => {
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

const CUBE_CENTER = 1
const CUBE_XP1 = 2
const CUBE_XM1 = 4
const CUBE_YP1 = 8
const CUBE_YM1 = 16
const CUBE_ZP1 = 32
const CUBE_ZM1 = 64
const CUBE_ALL = CUBE_CENTER + CUBE_XP1 + CUBE_XM1 + CUBE_YP1 + CUBE_YM1 + CUBE_ZP1 + CUBE_ZM1

function volume (x, y, z, xOffset = 1, yOffset = 1, zOffset = 1) {
  const xmin = xAxis[x]
  const xmax = xAxis[x + 1]
  const ymin = yAxis[y]
  const ymax = yAxis[y + 1]
  const zmin = zAxis[z]
  const zmax = zAxis[z + 1]
  return (xmax - xmin + xOffset) * (ymax - ymin + yOffset) * (zmax - zmin + zOffset)
}

function cubeOffset (x, y, z) {
  const zOffset = (xAxis.length - 1) * (yAxis.length - 1) * z
  const rowOffset = zOffset + (xAxis.length - 1) * y
  return rowOffset + x
}

function secureCubeOffset (x, y, z) {
  if (z < 0 || z >= zAxis.length - 1 ||
    y < 0 || y >= yAxis.length - 1 ||
    x < 0 || x >= xAxis.length - 1
  ) {
    return undefined
  }
  return cubeOffset(x, y, z)
}

function setCubeBorder (x, y, z, border) {
  const offset = secureCubeOffset(x, y, z)
  if (undefined === offset) {
    return 0 // does not exist, should count
  }
  if ((cubesBuffer[offset] & border) === border) {
    return 1 // already set, should not count
  }
  cubesBuffer[offset] |= border
  return 0 // set, should count
}

function clearCubeBorder (x, y, z, border) {
  const offset = secureCubeOffset(x, y, z)
  if (undefined === offset) {
    return 0 // does not exist, should count
  }
  if ((cubesBuffer[offset] & border) === 0) {
    return 1 // already cleared, should not count
  }
  cubesBuffer[offset] &= ~border
  return 0 // cleared, should count
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
    for (let y = cubeYmin; y < cubeYmax; ++y) {
      for (let x = cubeXmin; x < cubeXmax; ++x) {
        const offset = cubeOffset(x, y, z)
        if (on && ((cubesBuffer[offset] & CUBE_CENTER) === 0)) {
          cubesBuffer[offset] = CUBE_ALL
          const xOffset = 1 - setCubeBorder(x + 1, y, z, CUBE_XM1) - setCubeBorder(x - 1, y, z, CUBE_XP1)
          const yOffset = 1 - setCubeBorder(x, y + 1, z, CUBE_YM1) - setCubeBorder(x, y - 1, z, CUBE_YP1)
          const zOffset = 1 - setCubeBorder(x, y, z + 1, CUBE_ZM1) - setCubeBorder(x, y, z - 1, CUBE_ZP1)
          const count = volume(x, y, z, xOffset, yOffset, zOffset)
          // Remove share egdes
          step2Count += count
        }
        if (!on && ((cubesBuffer[offset] & CUBE_CENTER) !== 0)) {
          cubesBuffer[offset] = 0
          const xOffset = 1 - clearCubeBorder(x + 1, y, z, CUBE_XM1) - clearCubeBorder(x - 1, y, z, CUBE_XP1)
          const yOffset = 1 - clearCubeBorder(x, y + 1, z, CUBE_YM1) - clearCubeBorder(x, y - 1, z, CUBE_YP1)
          const zOffset = 1 - clearCubeBorder(x, y, z + 1, CUBE_ZM1) - clearCubeBorder(x, y, z - 1, CUBE_ZP1)
          const count = volume(x, y, z, xOffset, yOffset, zOffset)
          step2Count -= count
        }
      }
    }
  }
})

console.log('Step 2 :', step2Count)
