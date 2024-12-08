require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { plot } = await require('../lib/array')

  const width = lines[0].length
  const height = lines.length

  const antennas = {} /* type: [coords] */
  let y = 0
  for (const line of lines) {
    for (let x = 0; x < width; ++x) {
      const type = line[x]
      if (type !== '.') {
        antennas[type] ??= []
        antennas[type].push({ x, y })
      }
    }
    ++y
  }

  if (verbose) {
    console.log(antennas)
  }

  const solution1Grid = new Array(height).fill(0).map(_ => ''.padStart(width, '.'))
  let part1 = 0

  const inGrid = (x, y) => (x >= 0 && x < width && y >= 0 && y < height)

  const checkAndMark = (grid, x, y) => {
    if (inGrid(x, y)) {
      if (grid[y][x] !== '#') {
        plot(grid, x, y, '#')
        return 1
      }
    }
    return 0
  }

  for (const coords of Object.values(antennas)) {
    for (let fromIndex = 0; fromIndex < coords.length - 1; ++fromIndex) {
      const { x: fromX, y: fromY } = coords[fromIndex]
      for (let toIndex = fromIndex + 1; toIndex < coords.length; ++toIndex) {
        const { x: toX, y: toY } = coords[toIndex]
        const dx = toX - fromX
        const dy = toY - fromY

        part1 += checkAndMark(solution1Grid, fromX - dx, fromY - dy)
        part1 += checkAndMark(solution1Grid, toX + dx, toY + dy)
      }
    }
  }

  if (verbose) {
    console.log('Part 1 :\n--------')
    console.log(solution1Grid.join('\n'))
    console.log('Part 2 :\n--------')
  }

  yield part1

  const solution2Grid = new Array(height).fill(0).map(_ => ''.padStart(width, '.'))
  let part2 = 0

  for (const coords of Object.values(antennas)) {
    for (let fromIndex = 0; fromIndex < coords.length - 1; ++fromIndex) {
      const { x: fromX, y: fromY } = coords[fromIndex]
      for (let toIndex = fromIndex + 1; toIndex < coords.length; ++toIndex) {
        const { x: toX, y: toY } = coords[toIndex]
        const dx = toX - fromX
        const dy = toY - fromY

        let multiplier = 1
        while (inGrid(fromX - multiplier * dx, fromY - multiplier * dy)) {
          part2 += checkAndMark(solution2Grid, fromX - multiplier * dx, fromY - multiplier * dy)
          ++multiplier
        }

        multiplier = 1
        while (inGrid(toX + multiplier * dx, toY + multiplier * dy)) {
          part2 += checkAndMark(solution2Grid, toX + multiplier * dx, toY + multiplier * dy)
          ++multiplier
        }
      }
    }
  }

  for (const coords of Object.values(antennas)) {
    for (const { x, y } of coords) {
      part2 += checkAndMark(solution2Grid, x, y)
    }
  }

  if (verbose) {
    console.log(solution2Grid.join('\n'))
    console.log('Part 2 :\n--------')
  }

  yield part2 // > 632
})
