require('../challenge')(async function * ({
  assert,
  lines
}) {
  const width = lines[0].length
  const height = lines.length
  const treeHeights = lines.map(line => line.split(''))

  function isVisible (x, y) {
    const treeHeight = treeHeights[y][x]
    let left
    for (left = x - 1; left >= 0; --left) {
      if (treeHeights[y][left] >= treeHeight) {
        break
      }
    }
    if (left === -1) {
      return true
    }
    let right
    for (right = x + 1; right < width; ++right) {
      if (treeHeights[y][right] >= treeHeight) {
        break
      }
    }
    if (right === width) {
      return true
    }
    let top
    for (top = y - 1; top >= 0; --top) {
      if (treeHeights[top][x] >= treeHeight) {
        break
      }
    }
    if (top === -1) {
      return true
    }
    let bottom
    for (bottom = y + 1; bottom < height; ++bottom) {
      if (treeHeights[bottom][x] >= treeHeight) {
        break
      }
    }
    return bottom === height
  }

  let visible = 2 * width + 2 * height - 4 // borders are visible
  for (let y = 1; y < width - 1; ++y) {
    for (let x = 1; x < height - 1; ++x) {
      if (isVisible(x, y)) {
        ++visible
      }
    }
  }

  yield visible

  function calcScenicScore (x, y) {
    const treeHeight = treeHeights[y][x]
    let left
    for (left = x - 1; left > 0; --left) {
      if (treeHeights[y][left] >= treeHeight) {
        break
      }
    }
    let right
    for (right = x + 1; right < width - 1; ++right) {
      if (treeHeights[y][right] >= treeHeight) {
        break
      }
    }
    let top
    for (top = y - 1; top > 0; --top) {
      if (treeHeights[top][x] >= treeHeight) {
        break
      }
    }
    let bottom
    for (bottom = y + 1; bottom < height - 1; ++bottom) {
      if (treeHeights[bottom][x] >= treeHeight) {
        break
      }
    }
    return (x - left) * (right - x) * (y - top) * (bottom - y)
  }

  let maxScenicScore = 0
  for (let y = 1; y < width - 1; ++y) {
    for (let x = 1; x < height - 1; ++x) {
      const scenicScore = calcScenicScore(x, y)
      if (scenicScore > maxScenicScore) {
        maxScenicScore = scenicScore
        console.log(x, y, scenicScore)
      }
    }
  }

  yield maxScenicScore
})
