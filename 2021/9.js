require('../challenge')(function * ({
  lines
}) {
  const width = lines[0].length
  const height = lines.length

  function get (x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return 10
    }
    return Number(lines[y][x])
  }

  function isLow (x, y) {
    const value = get(x, y)
    return value < get(x - 1, y) &&
    value < get(x + 1, y) &&
    value < get(x, y - 1) &&
    value < get(x, y + 1)
  }

  function fillBasin (lowX, lowY) {
    const filled = []
    const rejected = []
    const candidates = [lowY * width + lowX]

    function tryAppend (x, y) {
      const coord = y * width + x
      if (!filled.includes(coord) && !rejected.includes(coord) && !candidates.includes(coord)) {
        candidates.push(coord)
      }
    }

    function adjacents (x, y) {
      if (x > 0) {
        tryAppend(x - 1, y)
      }
      if (x < width - 1) {
        tryAppend(x + 1, y)
      }
      if (y > 0) {
        tryAppend(x, y - 1)
      }
      if (y < height - 1) {
        tryAppend(x, y + 1)
      }
    }

    function fill (coord) {
      const x = coord % width
      const y = (coord - x) / width
      if (get(x, y) < 9) {
        filled.push(coord)
        adjacents(x, y)
      } else {
        rejected.push(coord)
      }
    }

    while (candidates.length) {
      fill(candidates.shift())
    }
    return filled.length
  }

  let sumOfRisksLevels = 0
  const basins = []
  for (let x = 0; x < width; ++x) {
    for (let y = 0; y < height; ++y) {
      const point = get(x, y)
      if (isLow(x, y)) {
        sumOfRisksLevels += point + 1
        basins.push(fillBasin(x, y))
      }
    }
  }

  console.log('Part 1 :', sumOfRisksLevels)
  yield sumOfRisksLevels
  const [firstBasin, secondBasin, thirdBasin] = basins.sort((a, b) => b - a)
  console.log('Part 2 :', firstBasin * secondBasin * thirdBasin)
  yield firstBasin * secondBasin * thirdBasin
})
