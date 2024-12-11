require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const { build: buildLoopControl } = await require('../lib/loop_control')

  const stones = lines[0].split(' ').map(Number)

  const VALIDATE = false

  function oldIterate (numberOfSteps) {
    const state = [...stones]
    if (verbose) {
      console.log('Initial :', state.join(','))
    }
    for (let step = 0; step < numberOfSteps; ++step) {
      let index = 0
      while (index < state.length) {
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
    }
    return state
  }

  /** Since order is not significant, trying a different approach */
  function iterate (numberOfSteps) {
    const loop = buildLoopControl(Number.POSITIVE_INFINITY)
    let state = new Map()
    stones.forEach(stone => state.set(stone, (state.get(stone) ?? 0) + 1))
    if (verbose) {
      console.log('Initial :', state)
    }
    for (let step = 0; step < numberOfSteps; ++step) {
      const newState = new Map()
      const currentStones = state.keys()
      for (const stone of currentStones) {
        loop.log('Iterating... {step}: {count}', { step, count: state.length })
        const count = state.get(stone)
        if (stone === 0) {
          newState.set(1, (newState.get(1) ?? 0) + count)
        } else if (stone.toString().length % 2 === 0) {
          const digits = stone.toString()
          const length = digits.length / 2
          const left = Number(digits.substring(0, length))
          const right = Number(digits.substring(length))
          newState.set(left, (newState.get(left) ?? 0) + count)
          newState.set(right, (newState.get(right) ?? 0) + count)
        } else {
          const newStone = stone * 2024
          newState.set(newStone, (newState.get(newStone) ?? 0) + count)
        }
      }
      state = newState
      if (verbose) {
        let totalNumberOfStones = 0
        state.forEach(count => { totalNumberOfStones += count })
        console.log(`[${step + 1}] : ${totalNumberOfStones}`, state)

        if (VALIDATE) {
          const oldIterations = oldIterate(step + 1)
          state.forEach((count, stone) => {
            const oldCount = oldIterations.filter(value => value === stone).length
            if (oldCount !== count) {
              console.error(`Error on ${stone} : ${count} !== ${oldCount} (old)`)
              process.exit(0)
            }
          })
        }
      }
    }
    let totalNumberOfStones = 0
    state.forEach(count => { totalNumberOfStones += count })
    return totalNumberOfStones
  }

  yield iterate(25)
  yield iterate(75)
})
