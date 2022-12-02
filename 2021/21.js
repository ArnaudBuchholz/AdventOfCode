require('../challenge')(function * ({
  lines,
  verbose
}) {
  const initialP1 = lines[0].match(/starting position: (\d+)/).map(Number)[1]
  const initialP2 = lines[1].match(/starting position: (\d+)/).map(Number)[1]

  let p1 = initialP1
  let p2 = initialP2
  console.log('P1 starts at', p1)
  console.log('P2 starts at', p2)

  let lastThrow = 0
  function deterministicThrow () {
    return ++lastThrow
  }

  let score1 = 0
  let score2 = 0
  let looserScore = 0

  function adjustPos (p) {
    while (p > 10) {
      p -= 10
    }
    return p
  }

  while (true) {
  // Player 1
    const throwP1 = deterministicThrow() + deterministicThrow() + deterministicThrow()
    p1 = adjustPos(p1 + throwP1)
    score1 += p1
    if (verbose) {
      console.log('P1 threw', throwP1, ' and moved to', p1)
    }

    if (score1 >= 1000) {
      looserScore = score2
      break
    }

    // Player 2
    const throwP2 = deterministicThrow() + deterministicThrow() + deterministicThrow()
    p2 = adjustPos(p2 + throwP2)
    score2 += p2

    if (verbose) {
      console.log('P2 threw', throwP2, ' and moved to', p2)
    }

    if (score2 >= 1000) {
      looserScore = score1
      break
    }
  }

  console.log('Score 1 :', score1)
  console.log('Score 2 :', score2)

  yield looserScore * lastThrow

  const gameStart = {
    p1: initialP1,
    score1: 0,
    p2: initialP2,
    score2: 0,
    turn: true, // p1
    mul: 1
  }

  const games = [gameStart]
  const wins = {
    p1: 0,
    p2: 0
  }

  let start = new Date()

  /*
  With the 3 dices, we can get from 3 to 9
  However, the number of times we get each is not the same
*/
  const frequencies = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  for (let die1 = 1; die1 < 4; ++die1) {
    for (let die2 = 1; die2 < 4; ++die2) {
      for (let die3 = 1; die3 < 4; ++die3) {
        const sum = die1 + die2 + die3
        ++frequencies[sum]
      }
    }
  }

  if (verbose) {
    console.log('Frequencies :', frequencies)
  }

  while (games.length) {
    const now = new Date()
    if (verbose && (now - start) > 5000) {
      console.log(games.length, wins)
      start = now
    }

    const game = games.pop()
    let p
    let score
    if (game.turn) {
      p = 'p1'
      score = 'score1'
    } else {
      p = 'p2'
      score = 'score2'
    }

    for (let die = 3; die < 10; ++die) {
      const nextGame = { ...game, turn: !game.turn }
      nextGame[p] = adjustPos(nextGame[p] + die)
      nextGame.mul *= frequencies[die]
      nextGame[score] += nextGame[p]
      if (nextGame[score] >= 21) {
        wins[p] += nextGame.mul
      } else {
        games.push(nextGame)
      }
    }
  }

  yield wins
})
