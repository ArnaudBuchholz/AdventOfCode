const { lines } = require('../lib')
const verbose = process.argv.includes('-verbose')

const enhancement = lines[0]
const image = lines.splice(1)

console.log(image)

const pixels = [
                 [-1, -1], [0, -1], [1, -1],
                 [-1, 0],  [0, 0],  [1, 0],
                 [-1, 1],  [0, 1],  [1, 1],
               ]

function enhance(from, refPixels) {
  const width = from[0].length
  const height = from.length

  const extendedFrom = new Array(height + 2).fill(0)
  extendedFrom[0] = ''.padStart(width + 2, '.')
  for (let y = 0; y < height; ++y) {
    extendedFrom[y + 1] = '.' + from[y] + '.'
  }
  extendedFrom[height + 1] = ''.padStart(width + 2, '.')

  const newImage = [...extendedFrom]
  for (y = 0; y < height; ++y) {
    const row = newImage[y + 1].split('')
    for (x = 0; x < width; ++x) {
      const offset = refPixels.reduce((value, [px, py]) => {
        const pixel = extendedFrom[y + 1 + py][x + 1 + px]
        if (pixel === '#') {
          return 2 * value + 1
        }
        return 2 * value
      }, 0)
      row[x + 1] = enhancement[offset]
    }
    newImage[y + 1] = row.join('')
  }
  return newImage
}

const step1 = enhance(image, pixels)
console.log(step1)