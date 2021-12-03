const { accessSync: access, readFileSync: readFile } = require('fs')
const { join } = require('path')

module.exports = function (day) {
  const fileName = join(__dirname, `input/${day}.txt`)
  try {
    access(fileName)
    return readFile(fileName).toString()
  } catch (e) {
    console.error(`Missing input for day #${day}`)
    process.exit(-1)
  }
}
