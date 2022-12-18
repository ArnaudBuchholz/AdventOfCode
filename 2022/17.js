require('../challenge')(async function * ({
  lines
}) {
  const { build: buildLoopControl } = await require('../lib/loop_control')
  const { detectRepetitionPattern } = await require('../lib/array')
  const moves = lines[0].split('')

  const pieces = [{
    /* #### */
    width: 4,
    height: 1,
    blocks: [[0, 0], [1, 0], [2, 0], [3, 0]]
  },
  {
    /* .#.
       ###
       .#. */
    width: 3,
    height: 3,
    blocks: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]
  },
  {
    /* ..#
       ..#
       ### */
    width: 3,
    height: 3,
    blocks: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]]
  },
  {
    /* #
       #
       #
       # */
    width: 1,
    height: 4,
    blocks: [[0, 0], [0, 1], [0, 2], [0, 3]]
  },
  {
    /* ##
       ## */
    width: 2,
    height: 2,
    blocks: [[0, 0], [0, 1], [1, 0], [1, 1]]
  }]

  function simulate (count) {
    const loop = buildLoopControl()

    const chamber = []
    chamber.increments = []
    const free = (x, y) => chamber[y] === undefined || chamber[y][x] === '.'
    const set = (x, y) => {
      const row = chamber[y] || '.......'
      chamber[y] = row.substring(0, x) + '#' + row.substring(x + 1)
    }

    let pieceIndex = 0
    let moveIndex = 0

    function collide (piece, x, y) {
      return piece.blocks.some(([dx, dy]) => !free(x + dx, y + dy))
    }

    function print (piece, x, y) {
      piece.blocks.forEach(([dx, dy]) => set(x + dx, y + dy))
    }

    while (count-- > 0) {
      loop.log('Computing... {count} {length}', { count, length: chamber.length })

      const piece = pieces[pieceIndex]
      let x = 2
      let y = chamber.length + 3
      const lastHeight = chamber.length

      while (true) {
        const move = moves[moveIndex]
        if (move === '>') {
          if (x + piece.width < 7 && !collide(piece, x + 1, y)) {
            ++x
          }
        } else if (move === '<') {
          if (x > 0 && !collide(piece, x - 1, y)) {
            --x
          }
        }
        moveIndex = (moveIndex + 1) % moves.length

        // move down
        if (y > 0 && !collide(piece, x, y - 1)) {
          --y
        } else {
          print(piece, x, y)

          // Keep track of increments to detect a repetition pattern
          const heightDiff = chamber.length - lastHeight
          chamber.increments.push(heightDiff)

          break
        }
      }

      pieceIndex = (pieceIndex + 1) % pieces.length
    }

    return chamber
  }

  const chamber = simulate(moves.length * pieces.length)
  // console.log([...chamber].reverse().join('\n'))

  const { skip, length } = detectRepetitionPattern(chamber.increments)
  console.log('Repetition pattern :', { skip, length })

  const skipHeight = chamber.increments.slice(0, skip).reduce((total, height) => total + height, 0)
  const lengthHeight = chamber.increments.slice(skip, skip + length).reduce((total, height) => total + height, 0)
  console.log('Corresponding heights :', { skipHeight, lengthHeight })

  function compute (count) {
    count -= skip
    const remainder = count % length
    const mul = (count - remainder) / length
    return skipHeight +
      mul * lengthHeight +
      chamber.increments.slice(skip, skip + remainder).reduce((total, height) => total + height, 0)
  }

  yield compute(2022)
  yield compute(1000000000000)
})
