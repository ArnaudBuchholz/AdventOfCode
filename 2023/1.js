require('../challenge')(function * ({
  lines,
  verbose
}) {
  yield lines.reduce((total, line) => {
    const firstDigit = line.match(/^[a-z]*([0-9])/i)[1]
    const lastDigit = line.match(/([0-9])[a-z]*$/i)[1]
    if (verbose) {
      console.log(line, firstDigit, lastDigit)
    }
    const value = parseInt(firstDigit + lastDigit, 10)
    return total + value
  }, 0)

  yield lines.reduce((total, line) => {
    let substituted = line
    // We can't just find and replace in any order (example: eightwothree => 823),
    // we need to scan the line sequentially to check if it contains a spelled number.
    // This is *not* the most efficient way...
    for (let pos = 0; pos < substituted.length; ++pos) {
      const stringAtPos = substituted.substring(pos)
      let number = 1
      for (const spelling of ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']) {
        if (stringAtPos.startsWith(spelling)) {
          substituted = substituted.substring(0, pos) + number + substituted.substring(pos)
          pos++ // skip injected digit
          break
        }
        ++number
      }
    }
    const firstDigit = substituted.match(/^[a-z]*([0-9])/i)[1]
    const lastDigit = substituted.match(/([0-9])[a-z]*$/i)[1]
    if (verbose) {
      console.log(line, substituted, firstDigit, lastDigit)
    }
    const value = parseInt(firstDigit + lastDigit, 10)
    return total + value
  }, 0)
})
