class Space {
  constructor (ranges) {
    this._ranges = structuredClone(ranges)
  }

  isInside (coord) {
    return this._ranges.every((range, axis) => {
      const p = coord[axis]
      return range[0] <= p && p <= range[1]
    })
  }

  translate (coord) {
    return coord.map((p, axis) => p - this._ranges[axis][0])
  }

  allocate (initialValue) {
    const sizes = this._ranges.map(([min, max]) => max - min + 1)
    function buffer ([size, ...sizes]) {
      if (sizes.length) {
        return new Array(size).fill(0).map(() => buffer(sizes))
      }
      return new Array(size).fill(initialValue)
    }
    this._buffer = buffer(sizes)
  }

  #get (coord) {
    return this.translate(coord).reduce((space, p) => space[p], this._buffer)
  }

  #checkBufferAccess (coord) {
    if (!this._buffer) {
      throw new Error('Not allocated')
    }
    if (!this.isInside(coord)) {
      throw new Error('Out of bounds')
    }
  }

  get (coord) {
    this.#checkBufferAccess(coord)
    return this.#get(coord)
  }

  set (coord, value) {
    this.#checkBufferAccess(coord)
    const translated = this.translate(coord)
    const space = this.#get(coord.slice(0, -1))
    space[translated.at(-1)] = value
  }

  forEach (coordCallback) {
    const { length: numberOfAxis } = this._ranges
    const lastAxis = numberOfAxis - 1
    const lastAxisMax = this._ranges[lastAxis][1]
    const current = this._ranges.map(([min]) => min)
    const next = (axis = 0) => {
      const [min, max] = this._ranges[axis]
      if (++current[axis] > max && axis < lastAxis) {
        current[axis] = min
        next(axis + 1)
      }
    }
    while (current[lastAxis] <= lastAxisMax) {
      let value
      if (this._buffer) {
        value = this.get(current)
      }
      coordCallback([...current], value)
      next()
    }
  }

  fill (from, getContentCallback) {
    const offsets = []
    const { length: numberOfAxis } = this._ranges
    const offset = new Array(numberOfAxis).fill(0)
    for (let axis = 0; axis < numberOfAxis; ++axis) {
      offset[axis] = +1
      offsets.push([...offset])
      offset[axis] = -1
      offsets.push([...offset])
      offset[axis] = 0
    }

    const todo = [from]
    const done = []

    const isIn = (array, coord) => array.some(candidate => candidate.every((c, i) => coord[i] === c))

    while (todo.length > 0) {
      const coord = todo.pop()
      done.push(coord)

      const value = getContentCallback(coord)
      if (value !== undefined) {
        this.set(coord, value)
        offsets.forEach(offset => {
          const next = offset.map((o, i) => coord[i] + o)
          if (this.isInside(next) && !isIn(todo, next) && !isIn(done, next)) {
            todo.push(next)
          }
        })
      }
    }
  }
}

module.exports = {
  build (ranges) {
    return new Space(ranges)
  }
}
