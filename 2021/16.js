const { lines } = require('../lib')
const assert = require('assert')

function parse (bytes) {
  let cursor = -1
  let bit
  let byte
  let eos = false

  function next () {
    if (++cursor === bytes.length) {
      eos = true
    }
    byte = parseInt(bytes[cursor] || '0', 16)
    bit = 8
  }

  next()

  function read (bitCount) {
    if (eos) {
      throw new Error('End of Stream')
    }
    let value = 0
    while (bitCount--) {
      value <<= 1
      if ((byte & bit) === bit) {
        ++value
      }
      bit >>= 1
      if (bit === 0) {
        next()
      }
    }
    return value
  }

  function parsePacket () {
    let bits = 6
    const packet = {
      version: read(3),
      type: read(3)
    }

    if (packet.type === 4) {
      const values = []
      let notLastGroup
      do {
        bits += 5
        notLastGroup = read(1)
        values.push(read(4))
      } while (notLastGroup)
      packet.value = values.reduce((sum, value) => sum * 16 + value, 0)
    } else if (packet.type !== 4) {
      packet.subs = []
      bits++
      const lengthTypeId = read(1)

      if (lengthTypeId === 0) {
        bits += 15
        let length = read(15)
        while (length) {
          const subPacket = parsePacket()
          packet.subs.push(subPacket)
          length -= subPacket.bits
          bits += subPacket.bits
        }
      } else {
        bits += 11
        let count = read(11)
        packet.subs = []
        while (count--) {
          const subPacket = parsePacket()
          packet.subs.push(subPacket)
          bits += subPacket.bits
        }
      }
    }

    packet.bits = bits
    return packet
  }

  const packets = []

  try {
    while (!eos) { // eslint-disable-line
      packets.push(parsePacket())
    }
  } catch (e) {
    if (!eos) {
      throw new Error('Unexpected')
    }
  }

  return packets
}

assert.deepEqual(parse('D2FE28'), [{
  bits: 21,
  version: 6,
  type: 4,
  value: 2021
}])

assert.deepEqual(parse('38006F45291200'), [{
  bits: 49,
  version: 1,
  type: 6,
  subs: [
    { bits: 11, version: 6, type: 4, value: 10 },
    { bits: 16, version: 2, type: 4, value: 20 }
  ]
}])

assert.deepEqual(parse('EE00D40C823060')[0], {
  bits: 51,
  version: 7,
  type: 3,
  subs: [
    { bits: 11, version: 2, type: 4, value: 1 },
    { bits: 11, version: 4, type: 4, value: 2 },
    { bits: 11, version: 1, type: 4, value: 3 }
  ]
})

function evaluate (packet) {
  const types = {
    0: () => packet.subs.reduce((sum, packet) => sum + evaluate(packet), 0),
    1: () => packet.subs.reduce((product, packet) => product * evaluate(packet), 1),
    2: () => packet.subs.reduce((minimum, packet) => Math.min(minimum, evaluate(packet)), Number.MAX_SAFE_INTEGER),
    3: () => packet.subs.reduce((maximum, packet) => Math.max(maximum, evaluate(packet)), 0),
    4: () => packet.value,
    5: () => {
      const first = evaluate(packet.subs[0])
      const second = evaluate(packet.subs[1])
      return first > second ? 1 : 0
    },
    6: () => {
      const first = evaluate(packet.subs[0])
      const second = evaluate(packet.subs[1])
      return first < second ? 1 : 0
    },
    7: () => {
      const first = evaluate(packet.subs[0])
      const second = evaluate(packet.subs[1])
      return first === second ? 1 : 0
    }
  }
  return types[packet.type]()
}

assert.strictEqual(evaluate(parse('C200B40A82')[0]), 3)
assert.strictEqual(evaluate(parse('04005AC33890')[0]), 54)
assert.strictEqual(evaluate(parse('880086C3E88112')[0]), 7)
assert.strictEqual(evaluate(parse('CE00C43D881120')[0]), 9)
assert.strictEqual(evaluate(parse('D8005AC2A8F0')[0]), 1)
assert.strictEqual(evaluate(parse('F600BC2D8F')[0]), 0)
assert.strictEqual(evaluate(parse('9C005AC2F8F0')[0]), 0)
assert.strictEqual(evaluate(parse('9C0141080250320F1802104A08')[0]), 1)

const packets = parse(lines[0])

function sumOfVersions (packet) {
  const total = packet.version
  if (packet.subs) {
    return total + packet.subs.reduce((subTotal, subPacket) => subTotal + sumOfVersions(subPacket), 0)
  }
  return total
}

console.log('Step 1 :', packets.reduce((sum, packet) => sum + sumOfVersions(packet), 0))
console.log('Step 2 :', evaluate(packets[0]))
