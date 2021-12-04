const { accessSync: access, readFileSync: readFile } = require('fs')
const { join, relative } = require('path')

const [, script, additional] = process.argv
const day = relative(__dirname, script)
const folder = additional === '-sample' ? 'sample' : 'input'

const fileName = join(__dirname, folder, `${day}.txt`)

try {
  access(fileName)
  module.exports = readFile(fileName).toString()
} catch (e) {
  console.error(`Missing ${folder} for day #${day}`)
  process.exit(-1)
}
