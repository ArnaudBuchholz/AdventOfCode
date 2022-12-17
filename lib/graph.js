module.exports = {
  shortest (from, to, getConnections) {
    const result = {
      path: undefined, // No solution
      length: Infinity
    }

    function check (path) {
      if (result.length > path.length) {
        result.length = path.length
        result.path = path
      }
    }

    const steps = [
      [from]
    ]

    while (steps.length) {
      const path = steps.pop()
      const last = path.at(-1)
      if (last === to) {
        check(path)
      } else if (path.length >= result.length) {
        continue
      } else {
        getConnections(last)
          .filter(node => !path.includes(node))
          .forEach(node => {
            steps.push([...path, node])
          })
      }
    }

    return result.path
  }
}