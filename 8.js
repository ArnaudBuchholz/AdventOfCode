const input = require('./input')

const attempts = input
  .split(/\r?\n/)
  .filter(line => !!line)
  .map(line => {
    const [uniqueSignalPatterns, fourDigitOutputValue] = line.split(' | ')
    const digits = uniqueSignalPatterns.split(' ')
    const outputs = fourDigitOutputValue.split(' ')
    return {
      digits,
      outputs
    }
  })

/*             frequency over the 10 digits
    aaaa       a = 8
   b    c      b = 6 <- unique
   b    c      c = 8
    dddd       d = 7
   e    f      e = 4 <- unique
   e    f      f = 9 <- unique
    gggg       g = 7                     */

const referenceSegmentsPerDigits = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg']
const asciiOfa = 'a'.charCodeAt(0)

function buildSegmentsFrequencies (segmentsPerDigits) {
  const frequencies = [0, 0, 0, 0, 0, 0, 0]
  segmentsPerDigits
    .forEach(segmentsForOneDigit => segmentsForOneDigit
      .split('')
      .forEach(segment => ++frequencies[segment.charCodeAt(0) - asciiOfa])
    )
  return frequencies
}

const referenceSegmentsFrequency = buildSegmentsFrequencies(referenceSegmentsPerDigits)
console.log(referenceSegmentsFrequency.reduce((summary, frequency, index) =>
  summary + ' ' + 'abcdefg'[index] + '=' + frequency
, 'Frequency chart :'))

const uniqueDigits = attempts.reduce((totalOfUniqueDigits, attempt) =>
  totalOfUniqueDigits + attempt.outputs.filter(output => [2/* 1 */, 3/* 7 */, 4/* 4 */, 7/* 8 */].includes(output.length)).length
, 0)
console.log('Part 1 :', uniqueDigits)

const sumOfNumbers = attempts.reduce((sum, { digits, outputs }) => {
  const allDigits = [...digits, ...outputs]
  const segmentsOf1 = allDigits.filter(segments => segments.length === 2)[0]
  const segmentsOf7 = allDigits.filter(segments => segments.length === 3)[0]
  const segmentsOf4 = allDigits.filter(segments => segments.length === 4)[0]

  /* Based on the 1 = ab, 7 = abd and 4 = abef, we know the following :
   *
   *   dddd                    dddd
   * e/f  a/b                e/f  a/b
   * e/f  a/b                e/f  a/b
   *    e/f    which means :    e/f
   *  .   a/b                c/g  a/b
   *  .   a/b                c/g  a/b
   *   ....                     c/g
   *
   * Then using frequency analysis, we can distinguish them
   */

  const segmentsFrequencies = buildSegmentsFrequencies(digits)
  const segmentsMapping = segmentsFrequencies.reduce((mapping, frequency, index) => {
    if (frequency === 6) {
      mapping[String.fromCharCode(asciiOfa + index)] = 'b'
    } else if (frequency === 4) {
      mapping[String.fromCharCode(asciiOfa + index)] = 'e'
    } else if (frequency === 9) {
      mapping[String.fromCharCode(asciiOfa + index)] = 'f'
    }
    return mapping
  }, {})

  // a correspond to the segment that differs between 1 and 7
  const a = segmentsOf7.split('').filter(segment => !segmentsOf1.includes(segment))[0]
  segmentsMapping[a] = 'a'
  // f is already known because of frequencies, gets c, the remaining segment of 1
  const c = segmentsOf1.split('').filter(segment => segmentsMapping[segment] === undefined)[0]
  segmentsMapping[c] = 'c'
  // Inside 4, we now have 3 known segments, check d, the remaining segment
  const d = segmentsOf4.split('').filter(segment => segmentsMapping[segment] === undefined)[0]
  segmentsMapping[d] = 'd'
  // We have only one unknown segment left : g
  const g = 'abcdefg'.split('').filter(segment => segmentsMapping[segment] === undefined)[0]
  segmentsMapping[g] = 'g'

  function decode (segments) {
    const decoded = segments.split('').map(segment => segmentsMapping[segment]).sort().join('')
    const digit = referenceSegmentsPerDigits.indexOf(decoded)
    return { decoded, digit }
  }

  // Check algorithm by decoding all digits
  digits.forEach(encodedDigit => {
    const { decoded, digit } = decode(encodedDigit)
    if (digit === -1) {
      console.log('Unexpected -1 while decoding digit')
      console.log('Reference :', referenceSegmentsPerDigits)
      console.log('digits    :', digits)
      console.log('outputs   :', outputs)
      console.log('mappings  :', segmentsMapping)
      console.log('Encoded   :', encodedDigit)
      console.log('Decoded   :', decoded)
      console.log('Digit     :', digit)
      process.exit(0)
    }
  })

  // Now we can decode the numbers
  const number = outputs.reduce((total, output) => {
    const { digit } = decode(output)
    return total * 10 + digit
  }, 0)
  // console.log(segmentsMapping, number)

  return sum + number
}, 0)
console.log('Part 2 :', sumOfNumbers)
