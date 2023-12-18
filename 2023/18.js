require('../challenge')(function * ({
  lines,
  isSample,
  verbose
}) {
  function resolve (input) {
    let x = 0
    let y = 0
    const vectors = [{ x: 0, y: 0 }]

    let perimeter = 0

    input.forEach(line => {
      const [, dir, rawLength] = line.match(/(U|D|L|R) (\d+)/)
      const length = Number(rawLength)
      perimeter += length
      const [newX, newY] = {
        U: [x, y - length],
        D: [x, y + length],
        L: [x - length, y],
        R: [x + length, y]
      }[dir]
      x = newX
      y = newY
      vectors.push({ x, y })
    })

    return (vectors.reduce((total, { x: x0, y: y0 }, index) => {
      const { x: x1, y: y1 } = vectors[(index + 1) % vectors.length]
      return total + (x1 + x0) * (y1 - y0)
    }, 0) + perimeter) / 2 + 1
  }

  yield resolve(lines)
  yield resolve(lines.map(line => {
    const [, hexa] = line.match(/\(#([^)]+)\)/)
    const length = Number('0x' + hexa.substring(0, 5))
    const dir = {
      0: 'R',
      1: 'D',
      2: 'L',
      3: 'U'
    }[hexa[5]]
    return `${dir} ${length}`
  }))
})
