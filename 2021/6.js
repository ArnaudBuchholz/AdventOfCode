const { lines } = require('../input')
const ages = lines[0].split(',').map(n => parseInt(n, 10))

function inc (array, index, offset) {
  array[index] = (array[index] ?? 0) + offset
}

let countPerAges = []
ages.forEach(age => inc(countPerAges, age, 1))

console.log('Initial state :', ages)
console.log('Initial count per ages :', countPerAges)

const days = [18, 80, 256]
const lastDay = days[days.length - 1] + 1
for (let day = 1; day < lastDay; ++day) {
  const newCountPerAges = []
  countPerAges.forEach((count, age) => {
    if (age === 0) {
      inc(newCountPerAges, 6, count)
      inc(newCountPerAges, 8, count)
    } else {
      inc(newCountPerAges, age - 1, count)
    }
  })
  countPerAges = newCountPerAges
  if (days.includes(day)) {
    console.log('After', day, 'days :', countPerAges.reduce((sum, countPerAge) => sum + countPerAge, 0))
  }
}
