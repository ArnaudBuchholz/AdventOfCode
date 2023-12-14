require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { build: buildLoopControl } = await require('../lib/loop_control')
  const { detectRepetitionPattern } = await require('../lib/array')

  const width = lines[0].length
  const height = lines.length

  const plot = (a, x, y, c) => {
    a[y] = a[y].substring(0, x) + c + a[y].substring(x + 1)
  }

  function north (a) {
    const result = [...a]
    for (let x = 0; x < width; ++x) {
      let top = 0
      for (let y = 0; y < height; ++y) {
        const dot = a[y][x]
        if (dot === 'O') {
          plot(result, x, y, '.')
          plot(result, x, top, 'O')
          ++top
        } else if (dot === '#') {
          top = y + 1
        }
      }
    }
    return result
  }

  function south (a) {
    const result = [...a]
    for (let x = 0; x < width; ++x) {
      let bottom = height - 1
      for (let y = height - 1; y >= 0; --y) {
        const dot = a[y][x]
        if (dot === 'O') {
          plot(result, x, y, '.')
          plot(result, x, bottom, 'O')
          --bottom
        } else if (dot === '#') {
          bottom = y - 1
        }
      }
    }
    return result
  }

  function east (a) {
    const result = [...a]
    for (let y = 0; y < height; ++y) {
      let right = width - 1
      for (let x = width - 1; x >= 0; --x) {
        const dot = a[y][x]
        if (dot === 'O') {
          plot(result, x, y, '.')
          plot(result, right, y, 'O')
          --right
        } else if (dot === '#') {
          right = x - 1
        }
      }
    }
    return result
  }

  function west (a) {
    const result = [...a]
    for (let y = 0; y < height; ++y) {
      let left = 0
      for (let x = 0; x < width; ++x) {
        const dot = a[y][x]
        if (dot === 'O') {
          plot(result, x, y, '.')
          plot(result, left, y, 'O')
          ++left
        } else if (dot === '#') {
          left = x + 1
        }
      }
    }
    return result
  }

  const load = a => a.reduce((total, line, y) => {
    return total + (height - y) * line.replace(/[^O]/g, '').length
  }, 0)

  yield load(north(lines))

  // console.log('North ⏶', '\n' + north(lines).join('\n'))
  // console.log('South ⏷', '\n' + south(lines).join('\n'))
  // console.log('East  ⏵', '\n' + east(lines).join('\n'))
  // console.log('West  ⏴', '\n' + west(lines).join('\n'))

  let result = [...lines]
  const results = []
  const loads = []
  const loop = buildLoopControl()
  for (let iteration = 0; iteration < 1000; ++iteration) {
    loop.log('Tilting... {iteration}', {
      iteration
    })
    result = north(result)
    result = west(result)
    result = south(result)
    result = east(result)
    results.push(result.join('\n'))
    loads.push(load(result))
  }
  console.log(loads)
  const { skip, length } = detectRepetitionPattern(results)

  if (verbose) {
    console.log({ skip, length })
  }

  const finalResultIndex = (1000000000 - skip) % length
  const finalResult = results[finalResultIndex].split('\n')

  yield load(finalResult)
  // 99905 too low
})
