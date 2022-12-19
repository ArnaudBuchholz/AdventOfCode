require('../challenge')(async function * ({
  assert,
  lines
}) {
  const { build: buildLoopControl } = await require('../lib/loop_control')

  const ORE = 0
  const CLAY = 1
  const OBSIDIAN = 2
  const GEODE = 3
  const MATERIALS = ['ore', 'clay', 'obsidian', 'geode']

  const blueprints = lines.map(line => {
    const match = line.match(/Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\./).map(Number)
    const [, index, oreOre, clayOre, obsidianOre, obsidianClay, geodeOre, geodeObsidian] = match
    return {
      index,
      [ORE]: { [ORE]: oreOre },
      [CLAY]: { [ORE]: clayOre },
      [OBSIDIAN]: { [ORE]: obsidianOre, [CLAY]: obsidianClay },
      [GEODE]: { [ORE]: geodeOre, [OBSIDIAN]: geodeObsidian }
    }
  })
  console.log(blueprints)

  const empty = (value = 0) => new Array(MATERIALS.length).fill(value)

  function process (blueprint, timeLimit) {
    const initialState = {
      stocks: empty(),
      rates: empty(),
      firsts: empty(Infinity),
      builds: empty(''),
      minute: 0
    }
    // Start with 1 ORE robot
    initialState.firsts[ORE] = 0
    initialState.rates[ORE] = 1

    function report (state) {
      const report = []
      for (let material = 0; material < MATERIALS.length; ++material) {
        report[material] = {
          name: MATERIALS[material],
          robot: state.rates[material],
          first: state.firsts[material],
          build: state.builds[material],
          stock: state.stocks[material]
        }
      }
      console.table(report)
    }

    let best = {
      stocks: empty(),
      firsts: empty(Infinity)
    }

    function check (state) {
      const built = state.stocks[GEODE]
      if (built > best.stocks[GEODE]) {
        // report(state)
        best = state
      }
    }

    const states = [initialState]
    const loop = buildLoopControl()
    while (states.length) {
      loop.log('Processing... {length}', { length: states.length })

      const state = states.pop()
      let {
        stocks,
        rates,
        firsts,
        builds,
        minute: stateMinute
      } = state

      const minute = stateMinute + 1

      if (minute > timeLimit) {
        check(state)
        continue
      }

      // Filter out those which required more time for the first robot of each category
      if (best.firsts.some((bestMinuteFor, material) => firsts[material] !== Infinity && firsts[material] > bestMinuteFor)) {
        continue
      }

      const nextStates = [
        { incRates: empty(), consumed: empty() }
      ]

      // Try building one robot at a time starting from the most important
      if (minute < timeLimit) {
        for (let robot = MATERIALS.length - 1; robot >= 0; --robot) {
          const recipe = blueprint[robot]
          const canBeBuilt = Object.keys(recipe).every(material => stocks[material] >= recipe[material])
          if (rates[GEODE] > 0 && robot < GEODE) {
            continue // seems like we stop building CLAY after first GEODE
          }
          if (canBeBuilt) {
            if (robot === MATERIALS.length - 1) {
              // If the 'biggest' robot can be built, don't bother with the empty state
              nextStates.shift()
            }
            const incRates = empty()
            const consumed = empty()
            ++incRates[robot]
            Object.keys(recipe).forEach(material => {
                consumed[material] += recipe[material]
            })
            nextStates.push({ incRates, consumed })
            break // Stop on highest building
          }
        }
      }

      // Collect
      for (let material = 0; material < MATERIALS.length; ++material) {
        stocks[material] += rates[material]
      }

      nextStates.forEach(({ incRates, consumed }) => {
        const newState = {
          stocks: [...stocks],
          rates: [...rates],
          firsts: [...firsts],
          builds: [...builds],
          minute,
        }
        consumed.forEach((dec, material) => { newState.stocks[material] -= dec })
        incRates.forEach((inc, material) => {
          if (inc) {
            if(rates[material] === 0) {
                newState.firsts[material] = minute
            }
            newState.builds[material] = builds[material] + minute + ','
          }
          newState.rates[material] += inc
        })
        states.push(newState)
      })
    }

    report(best)
    return best.stocks[GEODE]
  }

  console.log(process(blueprints[0], 24))
  console.log(process(blueprints[1], 24))

//   const solutions1 = blueprints.map(blueprint => process(blueprint, 24)).sort((a, b) => b - a)
//   yield solutions1[0]
})
