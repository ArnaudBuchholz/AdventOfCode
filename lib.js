const { accessSync: access, readFileSync: readFile } = require('fs')
const { join, relative, sep } = require('path')

const [, script, additional] = process.argv
const [year, day] = relative(__dirname, script).split(sep)
const folder = additional && additional.startsWith('-sample') ? 'sample' : 'input'
const sampleIndex = (/-sample(\d)/.exec(additional) || [])[1]
const fileName = join(__dirname, year, folder, `${day}${sampleIndex ? '.' + sampleIndex : ''}.txt`)

try {
  access(fileName)
  const input = readFile(fileName).toString()
  const lines = input.split(/\r?\n/).filter(line => !!line.trim())
  let numbers
  try {
    numbers = lines.map(Number)
  } catch (e) {
    numbers = []
  }
  module.exports = {
    input,
    lines,
    numbers
  }
} catch (e) {
  console.error(`Missing ${folder} for day #${day}`)
  process.exit(-1)
}
