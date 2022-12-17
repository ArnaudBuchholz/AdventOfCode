require('../challenge')(async function * ({
  isSample,
  lines
}) {
  const buildLoopControl = await require('../lib/loop_control')
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

  /*
    function log (chamber) {
      console.log([...chamber].reverse().join('\n'))
    }
  */

  function simulate (count) {
    const loop = buildLoopControl()

    const chamber = []
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
          break
        }
      }

      pieceIndex = (pieceIndex + 1) % pieces.length
    }

    return chamber
  }

  yield simulate(2022).length
  yield simulate(1000000000000).length
})
