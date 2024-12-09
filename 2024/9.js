require('../challenge')(async function * ({
  lines,
  verbose
}) {
  const input = lines[0].split('').map(Number)
  const size = input.reduce((total, digit) => total + digit, 0)

  const FREE = -1

  if (verbose) {
    console.log('Size :', size, '(expanded from', input.length, ')')
  }

  function part1 () {
    if (verbose) {
      console.log('Part 1 :\n--------')
    }

    const memory = new Array(size).fill(FREE)

    let lastFileId = -1
    let pos = 0
    let fill = true
    input.forEach(count => {
      if (fill) {
        ++lastFileId
        while (count > 0) {
          memory[pos] = lastFileId
          --count
          ++pos
        }
      } else {
        pos += count
      }
      fill = !fill
    })

    let freePos = memory.indexOf(FREE)
    let lastPos = memory.length - 1
    while (memory[lastPos] === FREE) {
      --lastPos
    }

    if (verbose) {
      console.log('Before compacting :')
      console.log(memory)
      console.log('freePos :', freePos)
      console.log('lastPos :', lastPos)
    }

    // compacting
    while (freePos < lastPos) {
      memory[freePos] = memory[lastPos]
      while (memory[freePos] !== FREE) {
        ++freePos
      }
      memory[lastPos] = FREE
      while (memory[lastPos] === FREE) {
        --lastPos
      }
    }

    if (verbose) {
      console.log('After compacting :')
      console.log(memory)
      console.log('freePos :', freePos)
      console.log('lastPos :', lastPos)
    }

    return memory.reduce((total, fileId, index) => {
      if (fileId === FREE) {
        return total
      }
      return total + fileId * index
    }, 0)
  }

  yield part1()

  function part2 () {
    if (verbose) {
      console.log('Part 2 :\n--------')
    }

    // Change representation to use blocks
    const memory = []

    let lastFileId = -1
    let fill = true
    input.forEach(size => {
      if (fill) {
        memory.push({ fileId: ++lastFileId, size })
      } else {
        memory.push({ fileId: FREE, size })
      }
      fill = !fill
    })

    if (verbose) {
      console.log('Before compacting :')
      console.log(memory)
      console.log('lastFileId :', lastFileId)
    }

    const glueFreeBlocksTogether = () => {
      let pos = 0
      while (pos < memory.length) {
        if (memory[pos].fileId === FREE) {
          let size = memory[pos].size
          let count = 1
          while ((pos + count < memory.length) && memory[pos + count].fileId === FREE) {
            size += memory[pos + count].size
            ++count
          }
          if (count > 1) {
            memory[pos].size = size
            memory.splice(pos + 1, count - 1)
          }
        }
        ++pos
      }
    }

    while (lastFileId > -1) {
      const blockPos = memory.findIndex(({ fileId }) => fileId === lastFileId)
      const block = memory[blockPos]
      const freePos = memory.findIndex(({ fileId, size }) => fileId === FREE && size >= block.size)
      if (freePos !== -1 && freePos < blockPos) {
        const free = memory[freePos]
        if (free.size > block.size) {
          memory.splice(freePos, 1, {
            ...block
          }, {
            fileId: FREE,
            size: free.size - block.size
          })
        } else {
          free.fileId = block.fileId
        }
        block.fileId = FREE
        glueFreeBlocksTogether()
      }
      --lastFileId
    }

    if (verbose) {
      console.log('After compacting :')
      console.log(memory)
    }

    let pos = 0
    return memory.reduce((total, { fileId, size }) => {
      if (fileId === FREE) {
        pos += size
        return total
      }
      while (size > 0) {
        total += fileId * pos
        ++pos
        --size
      }
      return total
    }, 0)
  }

  yield part2()
})
