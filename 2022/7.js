require('../challenge')(async function * ({
  assert,
  lines
}) {
  const $parent = Symbol('..')
  const $size = Symbol('size')
  const $name = Symbol('name')

  const fs = {
    [$name]: '/',
    [$size]: 0
  }

  let path = fs
  lines.forEach(line => {
    const match = line.match(/\$ cd (\.\.|\/|\w+)|\$ ls|dir (\w+)|(\d+) (\w+(?:\.\w+)?)/)
    const [, cd, dirName, fileSize, fileName] = match
    if (cd === '/') {
      path = fs
    } else if (cd === '..') {
      path = path[$parent]
    } else if (cd) {
      path = path[cd]
      assert.ok(!!path)
    } else if (dirName) {
      path[dirName] = {
        [$parent]: path,
        [$name]: path[$name] + dirName + '/',
        [$size]: 0
      }
    } else if (fileName) {
      const size = Number(fileSize)
      path[fileName] = size
      path[$size] += size
      let parent = path[$parent]
      while (parent) {
        parent[$size] += size
        parent = parent[$parent]
      }
    }
  })

  console.log(fs)

  function solution1 (path) {
    return Object.keys(path).reduce(
      (total, dirName) => total + solution1(path[dirName]),
      path[$size] < 100000 ? path[$size] : 0
    )
  }

  yield solution1(fs)

  const MAX_DISK_SPACE = 70000000
  const NEED_SPACE = 30000000

  const unusedSpace = MAX_DISK_SPACE - fs[$size]
  console.log('Unused space :', unusedSpace)

  const spaceToDelete = NEED_SPACE - unusedSpace
  console.log('Need to delete :', spaceToDelete)

  function solution2 (path) {
    return Object.keys(path).reduce(
      (list, dirName) => list.concat(solution2(path[dirName])),
      path[$size] > spaceToDelete ? [path] : []
    )
  }

  const candidates = solution2(fs).sort((f1, f2) => f1[$size] - f2[$size])
  console.log(candidates)

  yield candidates[0][$size]
})
