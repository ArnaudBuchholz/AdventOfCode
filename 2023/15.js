require('../challenge')(async function * ({
  lines,
  assert,
  verbose
}) {
  const hash = str => {
    const { length } = str
    let hash = 0
    for (let i = 0; i < length; ++i) {
      const code = str.charCodeAt(i)
      hash = ((hash + code) * 17) % 256
    }
    return hash
  }

  assert.strictEqual(hash('HASH'), 52)
  assert.strictEqual(hash('rn=1'), 30)
  assert.strictEqual(hash('cm-'), 253)
  assert.strictEqual(hash('qp=3'), 97)
  assert.strictEqual(hash('cm=2'), 47)
  assert.strictEqual(hash('qp-'), 14)
  assert.strictEqual(hash('pc=4'), 180)
  assert.strictEqual(hash('ot=9'), 9)
  assert.strictEqual(hash('ab=5'), 197)
  assert.strictEqual(hash('pc-'), 48)
  assert.strictEqual(hash('pc=6'), 214)
  assert.strictEqual(hash('ot=7'), 231)

  yield lines[0].split(',').reduce((total, str) => total + hash(str), 0)

  const boxes = []
  lines[0].split(',').forEach(step => {
    const [, label, operation] = step.match(/^(.*)(=\d+|-)/)
    const boxIndex = hash(label)
    if (operation === '-') {
      if (boxes[boxIndex]) {
        boxes[boxIndex] = boxes[boxIndex].filter(({ label: candidate }) => candidate !== label)
      }
    } else {
      const focal = Number(operation.substring(1))
      boxes[boxIndex] ??= []
      const index = boxes[boxIndex].findIndex(({ label: candidate }) => candidate === label)
      if (index !== -1) {
        boxes[boxIndex][index].focal = focal
      } else {
        boxes[boxIndex].push({ label, focal })
      }
    }
    if (verbose) {
      console.log('Step :', step)
      boxes.forEach((box, index) => {
        console.log(`Box ${index} : ${JSON.stringify(box)}`)
      })
    }
  })

  yield boxes.reduce((total, box, boxIndex) => total +
    (boxIndex + 1) * box.reduce((total, { focal }, index) => total + (index + 1) * focal, 0)
  , 0)
})
