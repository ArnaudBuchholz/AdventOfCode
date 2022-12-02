require('../challenge')(function * ({
  lines: moves
}) {
  const part1 = moves.reduce(({ depth, position }, move) => {
    const [command, arg] = move.split(' ')
    const iarg = parseInt(arg, 10)
    if (command === 'forward') {
      position += iarg
    } else if (command === 'down') {
      depth += iarg
    } else if (command === 'up') {
      depth -= iarg
    }
    return { depth, position }
  }, {
    depth: 0,
    position: 0
  })

  console.log('Part 1 :', part1)
  yield part1.depth * part1.position

  const part2 = moves.reduce(({ depth, position, aim }, move) => {
    const [command, arg] = move.split(' ')
    const iarg = parseInt(arg, 10)
    if (command === 'forward') {
      position += iarg
      depth += aim * iarg
    } else if (command === 'down') {
      aim += iarg
    } else if (command === 'up') {
      aim -= iarg
    }
    return { depth, position, aim }
  }, {
    depth: 0,
    position: 0,
    aim: 0
  })

  console.log('Part 2 :', part2)
  yield part2.depth * part2.position
})
