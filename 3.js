// const reportTxt = '00100\n11110\n10110\n10111\n10101\n01111\n00111\n11100\n10000\n11001\n00010\n01010'
const reportTxt = require('./input')(3)
const report = reportTxt.split('\n')

const numberOfBits = report[0].length
const bitsCounts = report.reduce((state, [...bits]) => {
  bits.forEach((bit, index) => ++state[index][bit])
  return state
}, new Array(numberOfBits).fill().map(_ => [0, 0]))

const gammaBits = bitsCounts.map(counts => counts[0] > counts[1] ? 0 : 1).join('')
const gamma = parseInt(gammaBits, 2)

const epsilon = (2 ** numberOfBits - 1) ^ gamma // Use XOR

console.log('Part 1 :',
  '\nGamma             :', gammaBits.padStart(numberOfBits, ' '), gamma,
  '\nEpsilon           :', epsilon.toString(2).padStart(numberOfBits, ' '), epsilon,
  '\nPower consumption :', gamma * epsilon)

function filter (strategy) {
  let values = [...report]
  for (let bitIndex = 0; bitIndex < numberOfBits; ++bitIndex) {
    const counts = values.reduce((state, [...bits]) => {
      ++state[bits[bitIndex]]
      return state
    }, [0, 0])
    let keepBitValue = counts[0] > counts[1] ? '0' : '1'
    if (strategy === 'least') {
      keepBitValue = ['1', '0'][keepBitValue] // invert
    }
    values = values.filter(([...bits]) => bits[bitIndex] === keepBitValue)
    if (values.length === 1) {
      break
    }
  }
  return values
}

const ogrBits = filter('most')[0]
const ogr = parseInt(ogrBits, 2)

const csrBits = filter('least')[0]
const csr = parseInt(csrBits, 2)

console.log('\nPart 2 :',
  '\nOxygen generator rating :', ogrBits.padStart(numberOfBits, ' '), ogr,
  '\nCO2 scrubber rating     :', csrBits.padStart(numberOfBits, ' '), csr,
  '\nLife support rating     :', ogr * csr)
