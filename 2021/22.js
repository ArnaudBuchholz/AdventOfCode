require('../challenge')(function * ({
  lines,
  verbose,
  option,
  assert
}) {
  const cap50 = option({ label: 'Cap boundaries to 50', cmd: '50' })

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

  yield step1Count

  function axisIntersect (cuboid1, cuboid2, axis) {
    const min1 = cuboid1[`${axis}min`]
    const max1 = cuboid1[`${axis}max`]
    const min2 = cuboid2[`${axis}min`]
    const max2 = cuboid2[`${axis}max`]
    if (min2 > max1) return null
    if (max2 < min1) return null

    const min = Math.max(min1, min2)
    const max = Math.min(max1, max2)
    return { min, max }
  }

  function intersect (cuboid1, cuboid2) {
    const x = axisIntersect(cuboid1, cuboid2, 'x')
    const y = axisIntersect(cuboid1, cuboid2, 'y')
    const z = axisIntersect(cuboid1, cuboid2, 'z')
    if (x === null || y === null || z === null) {
      return null
    }
    return { xmin: x.min, xmax: x.max, ymin: y.min, ymax: y.max, zmin: z.min, zmax: z.max }
  }

  function equal (cuboid1, cuboid2) {
    const dims = ['xmin', 'xmax', 'ymin', 'ymax', 'zmin', 'zmax']
    return dims.every(dim => cuboid1[dim] === cuboid2[dim])
  }

  function parse (cuboid) {
    const match = cuboid.match(/x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/)
    const [xmin, xmax, ymin, ymax, zmin, zmax] = [].slice.call(match, 1).map(Number)
    return { xmin, xmax, ymin, ymax, zmin, zmax }
  }

  assert.deepEqual(intersect(parse('x=-1..1,y=0..1,z=0..1'), parse('x=-1..1,y=2..3,z=0..1')), null)
  assert.deepEqual(intersect(parse('x=-1..1,y=0..1,z=0..1'), parse('x=-1..0,y=0..1,z=0..1')), parse('x=-1..0,y=0..1,z=0..1'))
  assert.deepEqual(intersect(parse('x=-1..1,y=0..1,z=0..1'), parse('x=-1..1,y=0..2,z=0..1')), parse('x=-1..1,y=0..1,z=0..1'))
  assert.deepEqual(intersect(parse('x=-1..1,y=0..1,z=0..1'), parse('x=-1..0,y=0..1,z=2..3')), null)

  assert.deepEqual(equal(parse('x=-1..1,y=0..1,z=0..1'), parse('x=-1..0,y=0..1,z=2..3')), false)
  assert.deepEqual(equal(parse('x=-1..1,y=0..1,z=0..1'), parse('x=-1..1,y=0..1,z=0..1')), true)

  function axisExtrude (cuboid, remove, axis) {
    const min = cuboid[`${axis}min`]
    const max = cuboid[`${axis}max`]
    const rmin = remove[`${axis}min`]
    const rmax = remove[`${axis}max`]
    if (rmax < max) {
      if (rmin > min) {
        return [{ min, max: rmin - 1 }, { min: rmax + 1, max }]
      }
      return [{ min: rmax + 1, max }]
    }
    return [{ min, max: rmin - 1 }]
  }

  function extrude (cuboid, remove) {
    const x = axisExtrude(cuboid, remove, 'x')
    const y = axisExtrude(cuboid, remove, 'y')
    const z = axisExtrude(cuboid, remove, 'z')
    const shapes = []
    x.forEach(({ min: xmin, max: xmax }) => {
      y.forEach(({ min: ymin, max: ymax }) => {
        z.forEach(({ min: zmin, max: zmax }) => {
          shapes.push({ xmin, xmax, ymin, ymax, zmin, zmax })
        })
      })
    })
    return shapes
  }

  assert.deepEqual(extrude(parse('x=-3..3,y=-3..3,z=-3..3'), parse('x=-1..1,y=0..3,z=0..3')), [
    parse('x=-3..-2,y=-3..-1,z=-3..-1'),
    parse('x=2..3,y=-3..-1,z=-3..-1')
  ])

  assert.deepEqual(extrude(parse('x=-3..3,y=-3..3,z=-3..3'), parse('x=-1..1,y=-1..1,z=-1..1')), [
    parse('x=-3..-2,y=-3..-2,z=-3..-2'),
    parse('x=-3..-2,y=-3..-2,z=2..3'),
    parse('x=-3..-2,y=2..3,z=-3..-2'),
    parse('x=-3..-2,y=2..3,z=2..3'),
    parse('x=2..3,y=-3..-2,z=-3..-2'),
    parse('x=2..3,y=-3..-2,z=2..3'),
    parse('x=2..3,y=2..3,z=-3..-2'),
    parse('x=2..3,y=2..3,z=2..3')
  ])

  function split (cuboid1, cuboid2) {
    if (equal(cuboid1, cuboid2)) {
      return [[], [], [cuboid1]]
    }
    const common = intersect(cuboid1, cuboid2)
    if (common === null) {
      return null
    }
    if (equal(cuboid1, common)) {
      return [[], extrude(cuboid2, common), common]
    }
    if (equal(cuboid2, common)) {
      return [extrude(cuboid1, common), [], common]
    }
    return [extrude(cuboid1, common), extrude(cuboid2, common), common]
  }

  function volume ({ xmin, xmax, ymin, ymax, zmin, zmax }) {
    return (xmax - xmin + 1) * (ymax - ymin + 1) * (zmax - zmin + 1)
  }

  let cuboids = []

  steps.forEach(step => {
    const nextCuboids = []
    let stepCuboids = [step]
    if (step.on) {
      cuboids.forEach(cuboid => {
        const resultOfSplit = split(cuboid, step)
        if (resultOfSplit === null) {
          nextCuboids.push(cuboid)
        } else {
          nextCuboids.push(...resultOfSplit[0], resultOfSplit[2])
          stepCuboids = resultOfSplit[1]
        }
      })
    }
    cuboids = [...nextCuboids, ...stepCuboids]
  })

  if (verbose) {
    console.log('Remaining cuboids :')
    cuboids.forEach(({ xmin, xmax, ymin, ymax, zmin, zmax }) => {
      console.log('x=', xmin, '..', xmax, 'y=', ymin, '..', ymax, 'z=', zmin, '..', zmax)
    })
  }

  yield cuboids.reduce((total, cuboid) => total + volume(cuboid), 0)
})
