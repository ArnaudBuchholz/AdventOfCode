const { accessSync: access, readFileSync: readFile } = require('fs')
const { join, relative, sep } = require('path')
const assert = require('assert')

const [, script, ...args] = process.argv
const [year, day] = relative(__dirname, script).split(sep)
const sample = args.filter(arg => arg.startsWith('-sample'))[0]
const folder = sample ? 'sample' : 'input'
const sampleIndex = (/-sample(\d)/.exec(sample) || [])[1]
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
  module.exports = async implementation => {
    try {
      const genSolutions = implementation({
        isSample: folder === 'sample',
        input,
        lines,
        numbers,
        verbose,
        assert,
        option: ({ label, cmd }) => process.argv.includes(`-${cmd}`)
      })
      const solutions = []
      for await (const solution of genSolutions) {
        solutions.push(solution)
      }
      console.log('Solutions', solutions)
    } catch (e) {
      console.error(e)
      process.exit(-1)
    }
  }
} catch (e) {
  console.error(`Missing ${folder} for day #${day}`)
  process.exit(-1)
}
