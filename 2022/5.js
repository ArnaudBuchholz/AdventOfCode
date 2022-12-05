require('../challenge')(async function * ({
  assert,
  lines
}) {
  const stacks = []
  lines.every(line => {
    const crates = []
    line.replace(/(?:\[(\w)\]| {3}) ?/g, (match, crate) => {
      crates.push(crate)
    })
    const hasCrates = crates.filter(Boolean).length > 0
    if (!hasCrates) {
      return false
    }
    crates.forEach((crate, index) => {
      if (crate) {
        if (!stacks[index]) {
          stacks[index] = []
        }
        stacks[index].unshift(crate)
      }
    })
    return true
  })

  function render (label, state) {
    console.log(label)
    const maxLength = state.reduce((length, crates) => Math.max(length, crates.length), 0)
    const pivot = []
    for (let height = maxLength - 1; height >= 0; --height) {
      const cratesByHeight = [height + 1]
      state.forEach((crates, index) => cratesByHeight.push(crates[height]))
      pivot.push(cratesByHeight)
    }
    console.table(pivot)
  }

  render('Part 1 initial state', stacks)
  const stacks1 = structuredClone(stacks)
  for (const line of lines) {
    const instruction = line.match(/move (\d+) from (\d+) to (\d+)/)
    if (instruction) {
      let [, count, from, to] = instruction.map(Number)
      --from
      --to
      while (count--) {
        const crate = stacks1[from].pop()
        assert.ok(!!crate)
        stacks1[to].push(crate)
      }
      // render('Part 1 : ' + line, stacks1)
    }
  }

  render('Part 1 final state', stacks1)
  yield stacks1.reduce((tops, stack) => [...tops, stack.at(-1)], []).join('')

  render('Part 2 initial state', stacks)
  const stacks2 = structuredClone(stacks)
  for (const line of lines) {
    const instruction = line.match(/move (\d+) from (\d+) to (\d+)/)
    if (instruction) {
      let [, count, from, to] = instruction.map(Number)
      --from
      --to
      const crates = []
      while (count--) {
        const crate = stacks2[from].pop()
        assert.ok(!!crate)
        crates.push(crate)
      }
      crates.reverse().forEach(crate => stacks2[to].push(crate))
      // render('Part 2 : ' + line, stacks2)
    }
  }
  render('Part 2 final state', stacks2)
  yield stacks2.reduce((tops, stack) => [...tops, stack.at(-1)], []).join('')
})
