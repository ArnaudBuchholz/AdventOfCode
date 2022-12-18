module.exports = {
  getContained (r1, r2) {
    const [from1, to1] = r1
    const [from2, to2] = r2
    if (from1 >= from2 && to1 <= to2) {
      return [from1, to1]
    }
    if (from2 >= from1 && to2 <= to1) {
      return [from2, to2]
    }
    return null
  },

  getIntersection (r1, r2) {
    const [from1, to1] = r1
    const [from2, to2] = r2
    if ((to1 < from2) || (from1 > to2) || (to2 < from1) || (from2 > to1)) {
      return null
    }
    return [Math.max(from1, from2), Math.min(to1, to2)]
  },

  empty () {
    return [+Infinity, -Infinity]
  },

  extend ([min, max], value) {
    return [Math.min(min, value), Math.max(max, value)]
  },

  isInside (r, value) {
    return r[0] <= value && value <= r[1]
  }
}
