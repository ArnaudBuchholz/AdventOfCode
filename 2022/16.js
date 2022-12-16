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

  function solution (maxTime) {
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

    const attempts = [{
      pos: 'AA',
      time: 0,
      opened: [],
      totalRate: 0,
      released: 0
    }]

    while (attempts.length) {
      if (Date.now() - timer > 1000) {
        timer = Date.now()
        console.log(`Searching... ${attempts.length} ${checked} ${result.released}`)
      }

      let {
        pos,
        from,
        time,
        opened,
        totalRate,
        released
      } = attempts.pop()

      const {
        rate,
        to
      } = rooms[pos]

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

      // move but avoid immediately turning back to previous room
      to
        .filter(room => room !== from)
        .forEach(room => attempts.push({
          pos: room,
          from: pos,
          time,
          opened,
          totalRate,
          released
        }))
      if (pos !== 'AA' && rate !== 0 && !opened.includes(pos)) {
        // open new valve
        attempts.push({
          pos,
          time,
          opened: [...opened, pos],
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
