require('../challenge')(function * ({
  lines,
  verbose
}) {
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

  function getLocation (seed) {
    let value = seed
    mappings.forEach(({ title, ranges }) => ranges.every(({ destination, source, length }) => {
      const offset = value - source
      if (offset >= 0 && offset < length) {
        value = destination + offset
        return false
      }
      return true
    }))
    return value
  }

  const locations = seeds.map(getLocation)
  yield Math.min(...locations)

  // Brut force
  const seedRanges = [...seeds]
  let minLocation = Number.POSITIVE_INFINITY
  while (seedRanges.length) {
    const base = seedRanges.shift()
    const count = seedRanges.shift()
    if (verbose) {
      console.log(`Processing [${base}; ${base + count - 1}]...`)
    }
    for (let index = 0; index < count; ++index) {
      minLocation = Math.min(minLocation, getLocation(base + index))
    }
  }
  yield minLocation
})
  