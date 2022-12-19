const {
  build
} = require('./space')

describe('space', () => {
  describe('2D space', () => {
    const space = build([
      [1, 5],
      [2, 6]
    ])

    it('translates coordinates', () => {
      expect(space.translate([1, 2])).toStrictEqual([0, 0])
    })

    it('checks if inside', () => {
      expect(space.isInside([1, 2])).toStrictEqual(true)
      expect(space.isInside([2, 3])).toStrictEqual(true)
      expect(space.isInside([5, 6])).toStrictEqual(true)
      expect(space.isInside([0, 2])).toStrictEqual(false)
      expect(space.isInside([0, 0])).toStrictEqual(false)
      expect(space.isInside([6, 3])).toStrictEqual(false)
    })

    describe('buffer', () => {
      beforeAll(() => { space.allocate(0) })

      it('stores information', () => {
        space.set([1, 2], 1)
        expect(space.get([1, 2])).toStrictEqual(1)
      })

      it('check bounds', () => {
        expect(() => space.set([0, 0])).toThrowError()
      })
    })

    describe('forEach', () => {
      const smallSpace = build([[0, 1], [2, 3]])

      it('enumerates the coordinates', () => {
        const coords = []
        smallSpace.forEach(coord => coords.push(coord))
        expect(coords).toStrictEqual([
          [0, 2],
          [1, 2],
          [0, 3],
          [1, 3]
        ])
      })
    })

    describe('fill', () => {
      let spaceToFill

      beforeAll(() => {
        spaceToFill = build([[0, 4], [0, 4]])
        /* 00000
           00100
           01010
           00100
           00000 */

        spaceToFill.allocate(0)
        spaceToFill.set([2, 1], 1)
        spaceToFill.set([1, 2], 1)
        spaceToFill.set([3, 2], 1)
        spaceToFill.set([2, 3], 1)
      })

      it('fills based on conditions', () => {
        spaceToFill.fill([0, 0], (coord) => spaceToFill.get(coord) === 0 ? 2 : undefined)
        /* 22222
           22122
           21012
           22122
           22222 */
        // untouched
        expect(spaceToFill.get([2, 1])).toStrictEqual(1)
        expect(spaceToFill.get([1, 2])).toStrictEqual(1)
        expect(spaceToFill.get([3, 2])).toStrictEqual(1)
        expect(spaceToFill.get([2, 3])).toStrictEqual(1)
        expect(spaceToFill.get([2, 2])).toStrictEqual(0)
        // filled
        expect(spaceToFill.get([3, 1])).toStrictEqual(2)
        expect(spaceToFill.get([4, 4])).toStrictEqual(2)
        let countOf2 = 0
        spaceToFill.forEach((coord, value) => {
          if (value === 2) {
            ++countOf2
          }
        })
        expect(countOf2).toStrictEqual(20)
      })
    })
  })
})
