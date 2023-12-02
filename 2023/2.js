require('../challenge')(function * ({
  lines,
  verbose
}) {
  const games = lines.map(line => {
    const content = {
      max: {
        red: 0,
        green: 0,
        blue: 0
      },
      draws: []
    }
    const draws = line.split(':')[1].split(';')
    draws.forEach(draw => {
      const results = {
        red: 0,
        green: 0,
        blue: 0
      }
      draw.replace(/(\d+) (\w+)/g, (_, count, color) => {
        results[color] = parseInt(count, 10)
      })
      content.max.red = Math.max(content.max.red, results.red)
      content.max.green = Math.max(content.max.green, results.green)
      content.max.blue = Math.max(content.max.blue, results.blue)
      content.draws.push(results)
    })
    if (verbose) {
      console.log(line, content)
    }
    return content
  })

  yield games.reduce((total, { draws }, index) => {
    if (draws.some(({ red, green, blue }) => {
      return red > 12 || green > 13 || blue > 14
    })) {
      return total
    }
    return total + index /* 0-based */ + 1
  }, 0)

  yield games.reduce((total, { max: { red, green, blue } }) => {
    return total + red * green * blue
  }, 0)
})
  