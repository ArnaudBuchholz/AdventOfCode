require('../challenge')(async function * ({
  lines
}) {
  const { contain, overlap } = await require('../lib/range')

  const pairs = lines.map(line => {
    const [, rawFrom1, rawTo1, rawFrom2, rawTo2] = line.match(/(\d+)-(\d+),(\d+)-(\d+)/)
    return [
      [Number(rawFrom1), Number(rawTo1)],
      [Number(rawFrom2), Number(rawTo2)]
    ]
  })

  console.log(pairs)

  yield pairs.reduce((total, [r1, r2]) => contain(r1, r2) ? total + 1 : total, 0)
  yield pairs.reduce((total, [r1, r2]) => overlap(r1, r2) ? total + 1 : total, 0)
})
