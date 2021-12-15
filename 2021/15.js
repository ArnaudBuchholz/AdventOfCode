const { lines } = require('../lib')

const risks = lines.map(row => row.split('').map(Number))
const width = risks[0].length
const height = risks.length

function run (part = 1) {
  const start = new Date()
  const overlap = part === 1 ? 1 : 5
  const overlappedWidth = overlap * width
  const overlappedHeight = overlap * height

  let lowestRisk = Number.MAX_SAFE_INTEGER
  const lowestRisks = new Array(overlappedHeight)
    .fill(0)
    .map(_ => new Array(overlappedWidth).fill(Number.MAX_SAFE_INTEGER))

  const stack = [{ x: 0, y: 0, risk: 0 }]

  function step () {
    const { x, y, risk } = stack.pop()

    if (risk >= lowestRisk || risk >= lowestRisks[y][x]) {
      return
    }
    lowestRisks[y][x] = risk

    if (x === overlappedWidth - 1 && y === overlappedHeight - 1) {
      lowestRisk = risk
      return
    }

    function add (nx, ny) {
      let nrisk = risks[ny % height][nx % width]
      const cycle = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      nrisk = cycle[((nrisk - 1) + (Math.floor(ny / height) + Math.floor(nx / width))) % cycle.length]
      stack.push({ x: nx, y: ny, risk: risk + nrisk })
    }

    /*
     * /!\ The order is important :
     * Since the next item to be processed is popped from the stack,
     * it must be the one that has most chances to succeed.
     * Hence, moves that goes backward are inserted first (and tested last)
     *
     */
    if (x > 0) {
      add(x - 1, y)
    }
    if (y > 0) {
      add(x, y - 1)
    }
    if (x < overlappedWidth - 1) {
      add(x + 1, y)
    }
    if (y < overlappedHeight - 1) {
      add(x, y + 1)
    }
  }

  let steps = 0
  while (stack.length) {
    ++steps
    step()
  }

  const timeSpent = (new Date()) - start

  console.log(`Step ${part} :`, lowestRisk, '(iterations :', steps, ', time :', timeSpent, 'ms)')
}

run(1)
run(5)
