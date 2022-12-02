require('../challenge')(function * ({
  numbers: depths
}) {
  function getIncreaseCount (array) {
    const { count } = array.reduce(({ last, count }, depth) => {
      if (last && depth > last) {
        ++count
      }
      return { last: depth, count }
    }, { count: 0 })
    return count
  }

  yield getIncreaseCount(depths)

  const windows = depths.slice(0, -2).map((depth, index) => {
    return depth + depths[index + 1] + depths[index + 2]
  })

  yield getIncreaseCount(windows)
})
