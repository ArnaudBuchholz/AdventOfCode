require('../challenge')(async function * ({
  lines
}) {
  function getMonkeys () {
    const monkeys = []

    lines.forEach(line => {
      if (line.startsWith('Monkey ')) {
        monkeys.push({
          activity: 0
        })
      } else {
        const monkey = monkeys.at(-1)
        if (line.startsWith('  Starting items: ')) {
          monkey.items = line.substring(18).split(', ').map(BigInt)
        } else if (line.startsWith('  Operation: ')) {
          const [, op, rawNumber] = line.match(/new = old (\*|\+) (\d+|old)/)
          if (op === '*') {
            if (rawNumber === 'old') {
              monkey.operation = value => value * value
            } else {
              const number = BigInt(rawNumber)
              monkey.operation = value => value * number
            }
          } else {
            const number = BigInt(rawNumber)
            monkey.operation = value => value + number
          }
        } else if (line.startsWith('  Test: divisible by ')) {
          monkey.divisible = BigInt(line.substring(21))
        } else if (line.startsWith('    If true: throw to monkey ')) {
          monkey.true = Number(line.substring(29))
        } else if (line.startsWith('    If false: throw to monkey ')) {
          monkey.false = Number(line.substring(30))
        }
      }
    })

    monkeys.factor = monkeys.reduce((factor, monkey) => factor * monkey.divisible, 1n)

    return monkeys
  }

  function round (monkeys, i, calmDown) {
    monkeys.forEach(monkey => {
      while (monkey.items.length > 0) {
        ++monkey.activity
        let item = monkey.items.shift()
        item = monkey.operation(item) % monkeys.factor
        if (calmDown) {
          item = item / 3n
        }
        if (item % monkey.divisible === 0n) {
          monkeys[monkey.true].items.push(item)
        } else {
          monkeys[monkey.false].items.push(item)
        }
      }
    })
    console.log(`Round ${i}`, ...monkeys.map(monkey => monkey.activity))
  }

  const part1Monkeys = getMonkeys()
  for (let i = 1; i <= 20; ++i) {
    round(part1Monkeys, i, true)
  }
  part1Monkeys.sort((m1, m2) => m2.activity - m1.activity)
  yield part1Monkeys[0].activity * part1Monkeys[1].activity

  const part2Monkeys = getMonkeys()
  console.log('Part 1', part2Monkeys)
  for (let i = 1; i <= 10000; ++i) {
    round(part2Monkeys, i, false)
  }
  part2Monkeys.sort((m1, m2) => m2.activity - m1.activity)
  yield part2Monkeys[0].activity * part2Monkeys[1].activity
})
