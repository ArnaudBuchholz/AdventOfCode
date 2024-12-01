require('../challenge')(function * ({
  lines,
  verbose
}) {
  const leftList = []
  const rightList = []
  for (const line of lines) {
    const [left, right] = line.split(/\s+/).map(Number)
    leftList.push(left)
    rightList.push(right)
  }
  leftList.sort()
  rightList.sort()
  if (verbose) {
    console.log('left  :', leftList.join())
    console.log('right :', rightList.join())
  }

  yield leftList.reduce((total, left, index) => total + Math.abs(left - rightList[index]), 0)

  yield leftList.reduce((total, left) => total + left * rightList.filter(right => right === left).length, 0)
})
