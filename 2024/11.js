require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { build: buildLoopControl } = await require('../lib/loop_control')

  const stones = lines[0].split(' ').map(Number)

  function iterate (numberOfSteps) {
    const loop = buildLoopControl(Number.POSITIVE_INFINITY)
    const state = [...stones]
    if (verbose) {
      console.log('Initial :', state.join(','))
    }
    for (let step = 0; step < numberOfSteps; ++step) {
      let index = 0
      while (index < state.length) {
        loop.log('Iterating... {step}: {count}', { step, count: state.length })
        const stone = state[index]
        if (stone === 0) {
          state[index] = 1
          ++index
        } else if (stone.toString().length % 2 === 0) {
          const digits = stone.toString()
          const length = digits.length / 2
          const left = Number(digits.substring(0, length))
          const right = Number(digits.substring(length))
          state.splice(index, 1, left, right)
          index += 2
        } else {
          state[index] = stone * 2024
          ++index
        }
      }
      if (verbose) {
        console.log(`[${step + 1}] :`, state.join(','))
      }
    }
    return state.length
  }

  yield iterate(25)
  yield iterate(75)
})
