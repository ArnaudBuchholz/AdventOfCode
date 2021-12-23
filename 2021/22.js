const assert = require('assert')
const { lines } = require('../lib')
const verbose = process.argv.includes('-verbose')

const steps = lines.map(line => {
  const match = line.match(/(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/)
  const on = match[1] === 'on'
  const [xmin, xmax, ymin, ymax, zmin, zmax] = [].slice.call(match,2).map(Number)
  if (verbose) {
    console.log(on ? 'on' : 'off', 'x=', xmin, '..', xmax, ' y=', ymin, '..', ymax, ' z=', zmin, '..', zmax, ' ')
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

function axisIntersect (a, b, axis) {
  const amin = a[`${axis}min`]
  const amax = a[`${axis}max`]
  const bmin = b[`${axis}min`]
  const bmax = b[`${axis}max`]
  if (bmin > amax) return null
  if (bmax < amin) return null

  let min = Math.max(amin, bmin)
  let max = Math.min(amax, bmax)
  return { min, max }
}

function intersect (a, b) {
  const x = axisIntersect(a, b, 'x')
  const y = axisIntersect(a, b, 'y')
  const z = axisIntersect(a, b, 'z')
  if (x === null || y === null || z === null) {
    return null
  }
  return { xmin: x.min, xmax: x.max, ymin: y.min, ymax: y.max, zmin: z.min, zmax: z.max }
}

function volume ({ xmin, xmax, ymin, ymax, zmin, zmax }) {
  return (xmax - xmin + 1) * (ymax - ymin + 1) * (zmax - zmin + 1)
}

let step2Count = 0

const on = []

steps.forEach((step, index) => {
/*
  if (step.on) {
    const points = volume(step)
    on.forEach(cube => {
      const common = intersect(step, cube)
      if (common !== null) {
        points -= volume(common)
      }
    })


    step2Count += 



  }
*/
})
