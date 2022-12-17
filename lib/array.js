module.exports = {
  unique (a) {
    const seen = {}
    return a.every(item => {
      if (seen[item] === undefined) {
        seen[item] = true
        return true
      }
      return false
    })
  },

  detectRepetitionPattern (a) {
    for (let skip = 0; skip < a.length - 2; ++skip) {
      for (let length = 1; length <= Math.floor((a.length - skip) / 2); ++length) {
        let checked
        for (checked = 0; checked < length; ++checked) {
          if (a[skip + checked] !== a[skip + checked + length]) {
            break
          }
        }
        if (checked === length) {
          // If any items remaining, check they match the pattern
          let toCheck = 2 * length
          while (skip + toCheck < a.length) {
            if (a[skip + toCheck] !== a[skip + (toCheck % length)]) {
              break
            }
            ++toCheck
          }
          if (skip + toCheck === a.length) {
            return { skip, length }
          }
        }
      }
    }
    return undefined
  }
}
