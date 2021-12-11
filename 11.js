const input = require('./input')
  .split(/\r?\n/)
  .filter(line => !!line)

const grid = []
input.forEach(line => {
  grid.push(line.split('').map(n => parseInt(n, 10)))
})
const width = grid[0].length
const height = grid.length

const toId = (x, y) => y * width + x
const fromId = id => { return { x: id % width, y: Math.floor(id / width) } }

function display () {
  grid.forEach(line => console.log(line.join('')))
}
display()

function step () {
  const flashes = []
  const around = []

  function check (x, y) {
    if (x > -1 && x < width && y > -1 && y < height) {
      const id = toId(x, y)
      if (!flashes.includes(id)) {
        const line = grid[y]
        let level = line[x]
        line[x] = ++level
        if (level === 10) {
          line[x] = 0
          flashes.push(id)
          around.push(id)
        }
      }
    }
  }

  grid.forEach((line, y) => {
    line.forEach((level, x) => {
      check(x, y)
    })
  })

  while (around.length) {
    const { x, y } = fromId(around.shift())
    check(x - 1, y - 1)
    check(x, y - 1)
    check(x + 1, y - 1)
    check(x - 1, y)
    check(x + 1, y)
    check(x - 1, y + 1)
    check(x, y + 1)
    check(x + 1, y + 1)
  }

  return flashes.length
}

let totalFlashes = 0
for (let count = 0; count < 1000; ++count) {
  const flashes = step()
  totalFlashes += flashes
  if (count === 99) {
    console.log('Part 1 :', totalFlashes)
  }
  if (flashes === width * height) {
    console.log('Part 2 :', count + 1)
    if (count > 99) {
      break
    }
  }
}
