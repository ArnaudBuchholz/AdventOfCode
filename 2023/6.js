require('../challenge')(async function * ({
  lines,
  verbose
}) {
  // const { getIntersection } = await require('../lib/range')
  const times = lines[0].split(':')[1].split(/\s+/).slice(1).map(Number)
  const distances = lines[1].split(':')[1].split(/\s+/).slice(1).map(Number)

  if (verbose) {
    console.log('times', times)
    console.log('distances', distances)
  }

  function getNumberOfWaysToWin (time, distance) {
    let count = 0
    for (let hold = 1; hold < time; ++hold) {
      const timeLeft = time - hold
      const resultDistance = timeLeft * hold
      if (resultDistance > distance) {
        ++count
      }
    }
    return count
  }

  yield times.reduce((total, time, index) => {
    return total * getNumberOfWaysToWin(time, distances[index])
  }, 1)

  const totalTime = Number(lines[0].split(':')[1].replace(/\s+/g, ''))
  const totalDistance = Number(lines[1].split(':')[1].replace(/\s+/g, ''))

  if (verbose) {
    console.log('time', totalTime)
    console.log('distance', totalDistance)
  }
  yield getNumberOfWaysToWin(totalTime, totalDistance)
})
