const { accessSync: access, readFileSync: readFile } = require('fs')
const { join, relative, sep } = require('path')
const assert = require('assert')

const [, script, additional] = process.argv
const [year, day] = relative(__dirname, script).split(sep)
const folder = additional && additional.startsWith('-sample') ? 'sample' : 'input'
const sampleIndex = (/-sample(\d)/.exec(additional) || [])[1]
const fileName = join(__dirname, year, folder, `${day}${sampleIndex ? '.' + sampleIndex : ''}.txt`)

try {
  access(fileName)
  const input = readFile(fileName).toString()
  const lines = input.split(/\r?\n/).filter(line => !!line.trim())
  const verbose = process.argv.includes('-verbose')
  let numbers
  try {
    numbers = lines.map(Number)
  } catch (e) {
    numbers = []
  }
  module.exports = implementation => {
    try {
      const gen = implementation({
        input,
        lines,
        numbers,
        verbose,
        assert,
        option: ({ label, cmd }) => process.argv.includes(`-${cmd}`)
      })
      const answers = [...gen]
      console.log('Solutions', answers)
    } catch (e) {
      console.error(e)
      process.exit(-1)
    }
  }
} catch (e) {
  console.error(`Missing ${folder} for day #${day}`)
  process.exit(-1)
}
