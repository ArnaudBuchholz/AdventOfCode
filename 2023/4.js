require('../challenge')(function * ({
  lines,
  verbose
}) {
  const winsPerGame = new Array(lines.length).fill(0)
  yield lines.reduce((total, line, index) => {
    const [, winning, numbers] = line.split(/:|\|/)
    const matching = []
    let score = 0
    numbers.trim().split(' ')
      .filter(number => number.trim())
      .forEach(number => {
        if (winning.includes(` ${number} `)) {
          matching.push(number)
          if (score === 0) {
            score = 1
          } else {
            score *= 2
          }
        }
      })
    if (verbose) {
      console.log(winning, numbers, score, matching)
    }
    winsPerGame[index] = matching.length
    return total + score
  }, 0)

  if (verbose) {
    console.log('winsPerGame', winsPerGame)
  }

  const multipliers = new Array(lines.length).fill(1)
  for (let i = 0; i < lines.length; ++i) {
    const multiplier = multipliers[i]
    const wins = winsPerGame[i]
    for (let j = i + 1; j <= i + wins; ++j) {
      multipliers[j] += multiplier
    }
  }

  if (verbose) {
    console.log('multipliers', multipliers)
  }

  yield multipliers.reduce((total, count) => total + count)
})
