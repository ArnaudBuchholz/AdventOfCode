require('../challenge')(function * ({
  lines,
  verbose
}) {
  function solve (dampener = false) {
    let safeCount = 0

    const isReportSafe = values => {
      let direction

      let last = values[0]
      return values.slice(1).every((current) => {
        if (last === current || Math.abs(last - current) > 3) {
          return false
        }
        if (direction === undefined) {
          direction = current > last
        } else if (direction) {
          if (current < last) {
            return false
          }
        } else {
          if (current > last) {
            return false
          }
        }
        last = current
        return true
      })
    }

    lines.forEach(line => {
      const values = line.split(/\s+/).map(Number)

      if (isReportSafe(values)) {
        ++safeCount
      } else if (dampener) {
        for (let index = 0; index < values.length; ++index) {
          const copyOfValues = [...values]
          copyOfValues.splice(index, 1)
          if (isReportSafe(copyOfValues)) {
            ++safeCount
            break
          }
        }
      }
    })
    return safeCount
  }

  yield solve()
  yield solve(true)
})
