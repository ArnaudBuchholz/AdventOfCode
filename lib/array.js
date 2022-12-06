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
  }
}
