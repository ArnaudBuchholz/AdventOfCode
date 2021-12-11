const { accessSync: access, readFileSync: readFile } = require('fs')
const { join, relative, sep } = require('path')

const [, script, additional] = process.argv
const [year, day] = relative(__dirname, script).split(sep)
const folder = additional === '-sample' ? 'sample' : 'input'
const fileName = join(__dirname, year, folder, `${day}.txt`)

try {
  access(fileName)
  const input = readFile(fileName).toString()
  const lines = input.split(/\r?\n/).filter(line => !!line.trim())
  const numbers = lines.map(n => parseInt(n, 10))
  module.exports = {
    input,
    lines,
    numbers
  }
} catch (e) {
  console.error(`Missing ${folder} for day #${day}`)
  process.exit(-1)
}
