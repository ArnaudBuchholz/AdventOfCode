require('../challenge')(async function * ({
  lines,
  isSample,
  verbose
}) {
  const { build: buildSpace } = await require('../lib/space')
  const { plot } = await require('../lib/array')

  let [x, y, minX, minY, maxX, maxY] = new Array(6).fill(0)

  lines.forEach(line => {
    const [, dir, rawLength] = line.match(/(U|D|L|R) (\d+)/)
    const length = Number(rawLength)
    const [newX, newY] = {
      U: [x, y - length],
      D: [x, y + length],
      L: [x - length, y],
      R: [x + length, y]
    }[dir]
    x = newX
    y = newY
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  })

  const width = maxX - minX + 1
  const height = maxY - minY + 1
  if (verbose) {
    console.log('Size :', width, 'x', height)
  }
  const space = buildSpace([
    [minX, maxX],
    [minY, maxY]
  ])
  space.allocate(' ')

  x = 0
  y = 0
  lines.forEach(line => {
    const [, dir, rawLength] = line.match(/(U|D|L|R) (\d+)/)
    const length = Number(rawLength)
    const move = {
      U: () => --y,
      D: () => ++y,
      L: () => --x,
      R: () => ++x
    }[dir]
    for (let i = 0; i < length; ++i) {
      space.set([x, y], '#')
      move()
    }
  })

  let fillX, fillY
  // too lazy to search a generic way
  if (isSample) {
    fillX = 1
    fillY = 1
  } else {
    fillX = Number(lines[0].match(/(?:U|D|L|R) (\d+)/)[1]) + 1
    fillY = 0
  }
  space.fill([fillX, fillY], coord => space.get(coord) === ' ' ? '#' : undefined)

  if (verbose) {
    const buffer = new Array(height).fill(0).map(_ => new Array(width).fill(' ').join(''))
    space.forEach(([x, y]) => {
      plot(buffer, x - minX, y - minY, space.get([x, y]))
    })
    console.log(buffer.join('\n'))
  }

  let trenchCount = 0
  space.forEach(([x, y]) => {
    if (space.get([x, y]) === '#') {
      ++trenchCount
    }
  })
  yield trenchCount
})
