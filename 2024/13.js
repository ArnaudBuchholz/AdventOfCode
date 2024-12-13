require('../challenge')(function * ({
  lines,
  verbose,
  assert
}) {
  const machines = lines.join('\n').split('Button A').slice(1).map((description) => {
    const [, ax, ay, bx, by, px, py] = description.match(/: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/)
    return {
      a: {
        x: Number(ax),
        y: Number(ay)
      },
      b: {
        x: Number(bx),
        y: Number(by)
      },
      prize: {
        x: Number(px),
        y: Number(py)
      }
    }
  })

  if (verbose) {
    console.log(machines)
  }

  const COST_OF_A = 3
  const COST_OF_B = 1

  /**
   * Part 1 :
   * 1) A*ax + B*bx = px
   * 2) A*ay + B*by = py
   *
   * 2) B = (py - A*ay)/by
   *
   * 1) A*ax + (py - A*ay)*bx/by = px
   * 1) A*ax + py*bx/by - A*ay*bx/by = px
   * 1) A*(ax - ay*bx/by) = px - py*bx/by
   *
   * 1) A = (px - py*bx/by)/(ax - ay*bx/by)
   * 2) B = (py - A*ay) / by
   */

  const PRECISION = 10000
  function integerize (value) {
    if (Math.floor(PRECISION * (value % 1)) === 0) {
      return Math.floor(value)
    }
    if (Math.floor(PRECISION * (value % 1)) === PRECISION - 1) {
      return Math.floor(value) + 1
    }
    return value
  }

  assert.strictEqual(integerize(20.000000000000004), 20)
  assert.strictEqual(integerize(35.99999999999987), 36)

  if (verbose) {
    console.log('Part 1 :\n--------')
  }

  let part1Tokens = 0
  machines.forEach(({ a, b, prize }, index) => {
    let A = (prize.x - prize.y * b.x / b.y) / (a.x - a.y * b.x / b.y)
    let B = (prize.y - A * a.y) / b.y

    // Bad JavaScript !
    A = integerize(A)
    B = integerize(B)

    if ((A % 1) === 0 && (B % 1) === 0) {
      if (verbose) {
        console.log(index, '✅ A=', A, ' B=', B)
      }
      part1Tokens += A * COST_OF_A + B * COST_OF_B
    } else if (verbose) {
      console.log(index, '❌ not possible', A, B)
    }
  })

  yield part1Tokens

  if (verbose) {
    console.log('Part 2 :\n--------')
  }

  let part2Tokens = 0

  machines.forEach(({ a, b, prize }, index) => {
    prize = { x: 10000000000000 + prize.x, y: 10000000000000 + prize.y }

    const A = Math.floor((prize.x - prize.y * b.x / b.y) / (a.x - a.y * b.x / b.y))
    const B = Math.floor((prize.y - A * a.y) / b.y)

    /** Because of lack of precision, try surrounding combinations (ugly but works) */
    const AMPLITUDE = 10
    let ok = false
    for (let da = -AMPLITUDE; !ok && da <= AMPLITUDE; ++da) {
      for (let db = -AMPLITUDE; !ok && db <= AMPLITUDE; ++db) {
        const NA = A + da
        const NB = B + db
        if ((NA * a.x + NB * b.x) === prize.x && (NA * a.y + NB * b.y) === prize.y) {
          if (verbose) {
            console.log(index, '✅ A=', NA, ' B=', NB)
          }
          part2Tokens += NA * COST_OF_A + NB * COST_OF_B
          ok = true
          break
        }
      }
    }

    if (!ok && verbose) {
      const px = A * a.x + B * b.x
      const py = A * a.y + B * b.y
      console.log(index, '❌ not possible', A, B, prize.x - px, prize.y - py)
    }
  })

  yield part2Tokens
})
