require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { build: buildLoopControl } = await require('../lib/loop_control')
  const { plot } = await require('../lib/array')

  const width = lines[0].length
  const height = lines.length

  function next ({ x, y, dir }, cache) {
    const tile = lines[y][x]
    const moves = {
      'U.': () => [[x, y - 1, 'U']],
      'D.': () => [[x, y + 1, 'D']],
      'L.': () => [[x - 1, y, 'L']],
      'R.': () => [[x + 1, y, 'R']],

      'U|': () => [[x, y - 1, 'U']],
      'D|': () => [[x, y + 1, 'D']],
      'L|': () => [[x, y - 1, 'U'], [x, y + 1, 'D']],
      'R|': () => [[x, y - 1, 'U'], [x, y + 1, 'D']],

      'U-': () => [[x - 1, y, 'L'], [x + 1, y, 'R']],
      'D-': () => [[x - 1, y, 'L'], [x + 1, y, 'R']],
      'L-': () => [[x - 1, y, 'L']],
      'R-': () => [[x + 1, y, 'R']],

      'U/': () => [[x + 1, y, 'R']],
      'D/': () => [[x - 1, y, 'L']],
      'L/': () => [[x, y + 1, 'D']],
      'R/': () => [[x, y - 1, 'U']],

      'U\\': () => [[x - 1, y, 'L']],
      'D\\': () => [[x + 1, y, 'R']],
      'L\\': () => [[x, y - 1, 'U']],
      'R\\': () => [[x, y + 1, 'D']]
    }
    const beams = moves[dir + tile]()
    if (!beams) {
      throw new Error('Unable to compute')
    }
    return beams
      .filter(([x, y]) => x >= 0 && x < width && y >= 0 && y < height)
      .filter(([x, y, dir]) => {
        if (tile === '.') {
          return true
        }
        // If the result of a collision has already been processed, ignore
        const key = `${x},${y},${dir}`
        if (cache.includes(key)) {
          return false
        }
        cache.push(key)
        return true
      })
      .map(([x, y, dir]) => ({ x, y, dir }))
  }

  function calculate (initial) {
    const loop = buildLoopControl()
    const tiles = [...lines]
    const beams = [initial]
    const cache = []
    while (beams.length) {
      loop.log('Beaming from ({x},{y},{dir})... {length}', {
        length: beams.length,
        ...initial
      })
      const beam = beams.pop()
      plot(tiles, beam.x, beam.y, '#')
      beams.push(...next(beam, cache))
    }
    return tiles.reduce((total, line) => total + line.replace(/[^#]/g, '').length, 0)
  }

  yield calculate({ x: 0, y: 0, dir: 'R' })

  let max = 0
  const loop = buildLoopControl()
  for (let x = 0; x < width; ++x) {
    loop.log('Calculating part2 (x)...')
    max = Math.max(max, calculate({ x, y: 0, dir: 'D' }))
    max = Math.max(max, calculate({ x, y: height - 1, dir: 'U' }))
  }
  for (let y = 0; y < height; ++y) {
    loop.log('Calculating part2 (y)...')
    max = Math.max(max, calculate({ x: 0, y, dir: 'R' }))
    max = Math.max(max, calculate({ x: width - 1, y, dir: 'L' }))
  }
  yield max
})
