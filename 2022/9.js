require('../challenge')(async function * ({
  lines
}) {
  function adjustKnot (tailX, tailY, headX, headY) {
    const distX = Math.abs(headX - tailX)
    const distY = Math.abs(headY - tailY)
    const incX = () => headX > tailX ? ++tailX : --tailX
    const incY = () => headY > tailY ? ++tailY : --tailY
    if (distY === 0 && distX > 1) {
      incX()
    } else if (distX === 0 && distY > 1) {
      incY()
    } else if (distX > 1 || distY > 1) {
      incX()
      incY()
    }
    return {
      x: tailX,
      y: tailY
    }
  }

  function solution (rope) { // rope[0] is head rope.at(-1) is tail
    const visited = [] // "x,y"

    lines.forEach(line => {
      const [, direction, rawSteps] = line.match(/(R|U|L|D) (\d+)/)
      let steps = Number(rawSteps)
      let incX = 0
      let incY = 0
      if (direction === 'U') {
        incY = -1
      } else if (direction === 'D') {
        incY = 1
      } else if (direction === 'L') {
        incX = -1
      } else if (direction === 'R') {
        incX = 1
      }
      while (steps-- > 0) {
        rope.forEach((knot, index) => {
          if (index === rope.length - 1) {
            return
          }
          let [headX, headY] = knot
          if (index === 0) {
            headX += incX
            headY += incY
            rope[0] = [headX, headY]
          }
          const [tailX, tailY] = rope[index + 1]
          const { x, y } = adjustKnot(tailX, tailY, headX, headY)
          rope[index + 1] = [x, y]
        })

        const [tailX, tailY] = rope.at(-1)
        const position = `${tailX},${tailY}`
        if (!visited.includes(position)) {
          visited.push(position)
        }

        console.log(direction, 'inc x :', incX, 'inc y :', incY, JSON.stringify(rope))
      }
    })

    return visited.length
  }

  const buildRope = knots => new Array(knots).fill([0, 0])

  yield solution(buildRope(2))

  yield solution(buildRope(10))
})
