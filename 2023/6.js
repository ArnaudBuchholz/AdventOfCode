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
    /**
     * Be x the number of ms you hold the button
     * Resulting distance is : (time - x) * x
     * We want this to be greater than distance :
     * -x^2 + x*time - distance > 0
     * 𝚫 = b^2 - 4*a*c
     * with a = -1
     *      b = time
     *      c = -distance
     * 𝚫 = time^2 - 4*distance
     * xStart = (-time + √𝚫)/-2
     * xStop = (-time - √𝚫)/-2
     */
    const delta = time * time - 4 * distance
    // assuming 𝚫 is always positive
    const xStart = Math.ceil((-time + Math.sqrt(delta)) / -2) 
    const xStop = Math.ceil((-time - Math.sqrt(delta)) / -2)
    return xStop - xStart
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
