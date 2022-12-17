module.exports = {
  buildTests (structure) {
    return () => {
      Object.keys(structure).forEach(name => {
        const { method, tests } = structure[name]
        describe(name, () => {
          tests.forEach(({ i, o }) => {
            const strInput = JSON.stringify(i, (key, value) => {
              if (typeof value === 'function') {
                return '⟪callback⟫'
              }
              return value
            })
            const params = strInput.substring(1, strInput.length - 1)
            it(`${method.name}(${params}) === ${JSON.stringify(o)}`, () => {
              expect(method.apply(null, i)).toStrictEqual(o)
            })
          })
        })
      })
    }
  }
}
