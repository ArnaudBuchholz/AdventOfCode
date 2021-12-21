const { lines } = require('../lib')
const verbose = process.argv.includes('-verbose')

const enhancement = lines[0]
const image = lines.splice(1)
image.outer = '.'

function display (from) {
  from.forEach(line => console.log(line))
}

if (verbose) {
  display(image)
}

const step1 = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [0, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1]
]

function enhance (from, pixels) {
  let width = from[0].length
  let height = from.length
  const buffer = Math.sqrt(pixels.length)

  const extendedFrom = new Array(height + 2 * buffer).fill(0)
  const bufferLine = ''.padStart(width + 2 * buffer, from.outer)

  for (let y = 0; y < height + 2 * buffer; ++y) {
    if (y < buffer) {
      extendedFrom[y] = bufferLine
    } else if (y < buffer + height) {
      extendedFrom[y] = ''.padStart(buffer, from.outer) + from[y - buffer] + ''.padStart(buffer, from.outer)
    } else {
      extendedFrom[y] = bufferLine
    }
  }

  width += 2 * buffer
  height += 2 * buffer

  function get (x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      return from.outer
    }
    return extendedFrom[y][x]
  }

  if (verbose) {
    console.log('Before, with buffer, outer :', from.outer)
    display(extendedFrom)
  }

  const newImage = [...extendedFrom]
  for (let y = 0; y < height; ++y) {
    const row = newImage[y].split('')
    for (let x = 0; x < width; ++x) {
      const offset = pixels.reduce((value, [px, py]) => {
        const pixel = get(x + px, y + py)
        if (pixel === '#') {
          return 2 * value + 1
        }
        return 2 * value
      }, 0)
      row[x] = enhancement[offset]
    }
    newImage[y] = row.join('')
  }

  if (from.outer === '.') {
    newImage.outer = enhancement[0]
  } else {
    newImage.outer = enhancement[511]
  }

  if (verbose) {
    console.log('After, outer : ', newImage.outer)
    display(newImage)
  }

  return newImage
}

const image1 = enhance(image, step1)
const image2 = enhance(image1, step1)

const pixelsLitAfter2Steps = image2.reduce((total, row) =>
  total + row.split('').filter(pixel => pixel === '#').length
, 0)
console.log('Step 1 :', pixelsLitAfter2Steps)

let count = 48
let nextImage = image2
while (count--) {
  nextImage = enhance(nextImage, step1)
}

const pixelsLitAfter50Steps = nextImage.reduce((total, row) =>
  total + row.split('').filter(pixel => pixel === '#').length
, 0)
console.log('Step 2 :', pixelsLitAfter50Steps)
