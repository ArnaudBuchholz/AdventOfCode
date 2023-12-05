require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { getContained, getIntersection } = await require('../lib/range')

  const seeds = lines[0].split(':')[1].trim().split(' ').map(Number)

  const mappings = []
  lines
    .slice(1)
    .filter(line => line.trim())
    .forEach(line => {
      if (line.includes(':')) {
        mappings.push({
          title: line.split(':')[0],
          ranges: []
        })
      } else {
        const [destination, source, length] = line.split(' ').map(Number)
        mappings[mappings.length - 1].ranges.push({ destination, source, length })
      }
    })

  if (verbose) {
    console.log('seeds:', seeds)
    console.log('mappings:', JSON.stringify(mappings, undefined, 2))
  }

  function getMinLocation (base, count) {
    let minLocation = Number.POSITIVE_INFINITY
    const stack = [{
      seed: base, // to keep track
      from: base,
      to: base + count - 1,
      mapping: 0,
      range: 0
    }]
    while (stack.length) {
      const { seed, from, to, mapping, range } = stack.pop()
      if (mapping >= mappings.length) {
        // Went over mappings
        minLocation = Math.min(minLocation, from)
        continue
      }
      const mappingDef = mappings[mapping]
      const { title } = mappingDef
      if (range >= mappingDef.ranges.length) {
        // Went over mappings' ranges
        if (verbose) {
          console.log(`Seed ${seed} ${title} ${seed}`)
        }
        stack.push({
          seed,
          from,
          to,
          mapping: mapping + 1,
          range: 0
        })
        continue
      }
      const { destination, source, length } = mappingDef.ranges[range]
      const intersect = getIntersection([from, to], [source, source + length - 1])
      if (intersect === null) {
          stack.push({
          seed,
          from,
          to,
          mapping,
          range: range + 1
        })
        continue
      }
      // Intersection goes to next mapping
      const newFrom = intersect[0] - source + destination
      if (verbose) {
        console.log(`Seed ${seed} ${title} ${newFrom}`)
      }
      stack.push({
        seed,
        from: newFrom,
        to: intersect[1] - source + destination,
        mapping: mapping + 1,
        range: 0
      })
      // Anything left goes to next range
      if (intersect[0] > from) {
        stack.push({
          seed,
          from,
          to: intersect[0] - 1,
          mapping: mapping,
          range: range + 1
        })
      }
      if (intersect[1] < to) {
        stack.push({
          seed,
          from: intersect[1] + 1,
          to,
          mapping: mapping,
          range: range + 1
        })
      }
    }
    return minLocation
  }

  const locations = seeds.map(seed => getMinLocation(seed, 1))
  if (verbose) {
    console.log('Step 1 locations:', locations)
  }
  yield Math.min(...locations)

  const seedRanges = [...seeds]
  let minLocation = Number.POSITIVE_INFINITY
  while (seedRanges.length) {
    const base = seedRanges.shift()
    const count = seedRanges.shift()
    if (verbose) {
      console.log(`Processing ${base}...`)
    }
    minLocation = Math.min(minLocation, getMinLocation(base, count))
  }
  yield minLocation
})
  