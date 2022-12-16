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

  function solution (maxTime, actors) {
    let timer = Date.now()

    const result = {
      opened: [],
      released: 0
    }

    let checked = 0
    function check (opened, released) {
      ++checked
      if (released > result.released) {
        result.released = released
        result.opened = opened
      }
    }

    const steps = [{
      pos: new Array(actors).fill('AA'),
      time: 0,
      opened: [],
      totalRate: 0,
      released: 0
    }]

    while (steps.length) {
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

      const actorPos = pos[0]
      const actorFrom = from[0]
      const {
        rate,
        to
      } = rooms[actorPos]

      // move but avoid immediately turning back to previous room
      to
        .filter(room => room !== actorFrom)
        .forEach(room => steps.push({
          pos: [room],
          from: [actorPos],
          time,
          opened,
          totalRate,
          released
        }))
      if (pos !== 'AA' && rate !== 0 && !opened.includes(actorPos)) {
        // open new valve
        steps.push({
          pos,
          time,
          opened: [...opened, actorPos],
          totalRate: totalRate + rate,
          released
        })
      }
    }

    console.log(checked, result)
    return result.released
  }

  yield solution(30, 1)
})
