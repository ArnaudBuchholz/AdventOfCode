require('../challenge')(function * ({
  assert,
  lines
}) {
  const ROCK = 1
  const PAPER = 2
  const SCISSOR = 3

  const beats = {
    [ROCK]: SCISSOR,
    [PAPER]: ROCK,
    [SCISSOR]: PAPER
  }

  function scoreForP2 (p1, p2) {
    if (p1 === p2) {
      return p2 + 3
    }
    if (beats[p2] === p1) {
      return p2 + 6
    }
    return p2
  }

  assert.strictEqual(scoreForP2(ROCK, PAPER), 8)
  assert.strictEqual(scoreForP2(PAPER, ROCK), 1)
  assert.strictEqual(scoreForP2(SCISSOR, SCISSOR), 6)

  yield lines.reduce((score, line) => {
    let [,p1, p2] = line.match(/(A|B|C) (X|Y|Z)/)
    p1 = { A: ROCK, B: PAPER, C: SCISSOR }[p1]
    assert.notStrictEqual(p1, undefined)
    p2 = { X: ROCK, Y: PAPER, Z: SCISSOR }[p2]
    assert.notStrictEqual(p2, undefined)
    return score + scoreForP2(p1, p2)
  }, 0)

  const LOSE = 'X'
  const DRAW = 'Y'
  const WIN = 'Z'

  function calcP2(p1, objective) {
    if (objective === DRAW) {
      return p1
    }
    if (objective === LOSE) {
      return beats[p1]
    }
    return [ROCK, PAPER, SCISSOR].filter(p => beats[p] === p1)[0]
  }

  yield lines.reduce((score, line) => {
    let [,p1, objective] = line.match(/(A|B|C) (X|Y|Z)/)
    p1 = { A: ROCK, B: PAPER, C: SCISSOR }[p1]
    assert.notStrictEqual(p1, undefined)
    p2 = calcP2(p1, objective)
    assert.notStrictEqual(p2, undefined)
    return score + scoreForP2(p1, p2)
  }, 0)
})
