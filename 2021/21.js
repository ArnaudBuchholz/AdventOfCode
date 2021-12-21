const { lines } = require('../lib')
const verbose = process.argv.includes('-verbose')

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

console.log('Step 1 :', looserScore * lastThrow)

/*

let mvP1 = [initialP1, initialP1, initialP1]
let mvScore1 = [0, 0, 0]

let mvP2 = [initialP2, initialP2, initialP2]
let mvScore2 = [0, 0, 0]

 * shot 1
 * p1 + 1, p1 + 2, p1 + 3
 * 
 * shot 2
 * p1 + 1 + 1, p1 + 1 + 2, p1 + 1 + 3, p1 + 2 + 1, p1 + 2 + 2, p1 + 2 + 3, p1 + 3 + 1, p1 + 3 + 2, p1 + 3 + 3

while (true) {

}
*/
