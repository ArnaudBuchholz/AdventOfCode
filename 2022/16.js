require('../challenge')(async function * ({
  isSample,
  lines
}) {
  const rooms = lines.reduce((map, line) => {
    const match = line.match(/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (\w+(?:, \w+)*)/)
    const [, name, strRate, connects] = match
    map[name] = {
      name,
      rate: Number(strRate),
      to: connects.split(', ')
    }
    return map
  }, {})

  const valvesToOpen = Object.keys(rooms).filter(room => rooms[room].rate !== 0).length
  console.log(rooms, valvesToOpen)

  function solution (maxTime, actorCount) {
    let timer = Date.now()

    const result = {
      opened: [],
      released: 0
    }

    let iterations = 0
    let checked = 0
    function check (opened, released) {
      if (checked === 0) {
        console.log(`First result after ${iterations} iterations`)
      }
      ++checked
      if (released > result.released) {
        result.released = released
        result.opened = opened
      }
    }

    const steps = [{
      pos: new Array(actorCount).fill('AA'),
      time: 0,
      opened: [],
      totalRate: 0,
      released: 0
    }]

    while (steps.length) {
      ++iterations

      if (Date.now() - timer > 1000) {
        timer = Date.now()
        console.log(`Searching... ${steps.length} ${checked} ${result.released}`)
      }

      let {
        pos,
        from = [],
        time,
        opened,
        totalRate,
        released
      } = steps.pop()

      ++time
      released += totalRate

      if (time === maxTime) {
        check(opened, released)
        continue
      }

      if (opened.length === valvesToOpen) {
        check(opened, released + (maxTime - time) * totalRate)
        continue
      }

      const nextPossibleActionsByActor = []

      for (let actor = 0; actor < actorCount; ++actor) {
        const actions = []
        nextPossibleActionsByActor.push(actions)

        const actorPos = pos[0]
        const actorFrom = from[0]
        const {
          rate,
          to
        } = rooms[actorPos]
  
        // move but avoid immediately turning back to previous room
        to
          .filter(room => room !== actorFrom)
          .forEach(room => actions.push({
            move: {
              to: room,
              from: actorPos
            }
          }))
        if (pos !== 'AA' && rate !== 0 && !opened.includes(actorPos)) {
          // open new valve
          actions.push({
            open: {
              valve: actorPos,
              rate
            }
          })
        }
      }

      if (actorCount === 1) {
        nextPossibleActionsByActor[0].forEach(({ move, open }) => {
          if (move) {
            steps.push({
              pos: [move.to],
              from: [move.from],
              time,
              opened,
              totalRate,
              released
            })
          } else /* if(open) */ {
            steps.push({
              pos,
              from: [undefined],
              time,
              opened: [...opened, open.valve],
              totalRate: totalRate + open.rate,
              released
            })
          }
        })
      } else if (actorCount === 2) {
        nextPossibleActionsByActor[0].forEach(({ move: move0, open: open0 }) => {
          nextPossibleActionsByActor[1].forEach(({ move: move1, open: open1 }) => {
            if (open0 && open1) {
              if (open0.valve === open1.valve) {
                return // non sense
              }
              steps.push({
                pos,
                from: [undefined, undefined],
                time,
                opened: [...opened, open0.valve, open1.valve],
                totalRate: totalRate + open0.rate + open1.rate,
                released
              })
            // Must be a better way...
            } else if (open0 && move1) {
              steps.push({
                pos: [pos[0], move1.to],
                from: [undefined, move1.from],
                time,
                opened: [...opened, open0.valve],
                totalRate: totalRate + open0.rate,
                released
              })

            } else if (move0 && open1) {
              steps.push({
                pos: [move0.to, pos[1]],
                from: [move0.from, undefined],
                time,
                opened: [...opened, open1.valve],
                totalRate: totalRate + open1.rate,
                released
              })

            } else if (move0 && move1) {
              steps.push({
                pos: [move0.to, move1.to],
                from: [move0.from, move1.from],
                time,
                opened,
                totalRate,
                released
              })

            }
          })
        })
      }
    }

    console.log(checked, result)
    return result.released
  }

  yield solution(30, 1)
  // yield solution(26, 2)
})
