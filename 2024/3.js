require('../challenge')(function * ({
  lines,
  verbose
}) {
  function process (regexp) {
    let sum = 0
    let compute = true
    lines.forEach(line => {
      line.replace(regexp, (formula, operand1, operand2) => {
        if (verbose) {
          console.log(formula, compute)
        }
        if (formula === 'do()') {
          compute = true
        } else if (formula === 'don\'t()') {
          compute = false
        } else if (compute) {
          sum += Number(operand1) * Number(operand2)
        }
      })
    })
    return sum
  }

  yield process(/mul\((\d+),(\d+)\)/g)
  yield process(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g)
})
