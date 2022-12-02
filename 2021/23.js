require('../challenge')(({ lines, verbose }) => {
  const cols = new Array(4).fill(0).map((_, index) => [lines[2][3 + 2 * index], lines[3][3 + 2 * index]])
  console.log(lines)
  console.log(cols)
})
