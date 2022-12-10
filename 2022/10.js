require('../challenge')(async function * ({
  isSample,
  assert,
  lines
}) {
  function execute (lines) {
    let x = 1
    const cycles = [x]

    lines.forEach((line, step) => {
      const push = () => {
        cycles.push(x)
        console.log(cycles.length - 1, cycles.at(-1), `[${step}] ${line}`)
      }

      if (line === 'noop') {
        push()
      } else if (line.startsWith('addx ')) {
        const inc = Number(line.substring(5))
        push()
        push()
        x += inc
      }
    })

    cycles.push(x)
    return cycles
  }

  const x = execute(lines)
  console.log(x)
  if (isSample) {
    assert.strictEqual(x[20], 21, 20)
    assert.strictEqual(x[60], 19, 60)
    assert.strictEqual(x[100], 18, 100)
    assert.strictEqual(x[140], 21, 140)
    assert.strictEqual(x[180], 16, 180)
    assert.strictEqual(x[220], 18, 220)
  }

  const solution = 20 * x[20] + 60 * x[60] + 100 * x[100] + 140 * x[140] + 180 * x[180] + 220 * x[220]
  yield solution

  const output = []
  for (let cycle = 1; cycle < 241; ++cycle) {
    const xOffset = cycle % 40
    if (xOffset === 1) {
      output.push([])
    }
    const xForThatCycle = x[cycle]
    if (xForThatCycle <= xOffset && xOffset < xForThatCycle + 3) {
      output.at(-1).push('#')
    } else {
      output.at(-1).push(' ')
    }
  }
  output.forEach(line => console.log(line.join('')))

  yield 'Look at the console'
})
