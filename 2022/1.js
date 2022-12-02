require('../challenge')(function * ({
  input
}) {
  const caloriesPerElves = input.split(/\r?\n/)
    .reduce((array, calories) => {
      if (!calories) {
        array.push(0)
      }
      array[array.length - 1] += Number(calories)
      return array
    }, [0])

  console.log('caloriesPerElves', caloriesPerElves)
  yield caloriesPerElves.reduce((max, amount) => Math.max(max, amount), 0)

  caloriesPerElves.sort((a, b) => b - a)
  yield caloriesPerElves[0] + caloriesPerElves[1] + caloriesPerElves[2]
})
