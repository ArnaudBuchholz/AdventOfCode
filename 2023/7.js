require('../challenge')(function * ({
  lines,
  verbose
}) {
  const TYPE_FIVE_OF_A_KIND = 0
  const TYPE_FOUR_OF_A_KIND = 1
  const TYPE_FULL_HOUSE = 2
  const TYPE_THREE_OF_A_KIND = 3
  const TYPE_TWO_PAIRS = 4
  const TYPE_ONE_PAIR = 5
  const TYPE_HIGH_CARD = 6

  const labels = [
    'FIVE_OF_A_KIND',
    'FOUR_OF_A_KIND',
    'FULL_HOUSE',
    'THREE_OF_A_KIND',
    'TWO_PAIRS',
    'ONE_PAIR',
    'HIGH_CARD'
  ]

  const maxSameCount = Symbol('maxSameCount')

  function buildSolution (order, detectType) {
    const hands = lines.map(line => {
      const [cards, rawBid] = line.split(' ')
      const bid = Number(rawBid)

      const perLabel = cards.split('').reduce((accumulator, card) => {
        accumulator[card] ??= 0
        ++accumulator[card]
        accumulator[maxSameCount] = Math.max(accumulator[maxSameCount], accumulator[card])
        return accumulator
      }, {
        [maxSameCount]: 0
      })

      return { cards, perLabel, type: detectType(perLabel), bid }
    })

    if (verbose) {
      console.log(`Detected hands ${detectType.name}`)
      hands
        .forEach(({ cards, perLabel, type }) => {
          console.log(cards, labels[type], perLabel)
        })
    }

    // sort with the highest rank last
    const ordered = hands.sort((hand1, hand2) => {
      // <0 means hand1 < hand2
      if (hand1.type < hand2.type) {
        return 1 // hand2 first
      }
      if (hand1.type > hand2.type) {
        return -1 // hand1 first
      }
      for (let cardIndex = 0; cardIndex < hand1.cards.length; ++cardIndex) {
        const order1 = order.indexOf(hand1.cards[cardIndex])
        const order2 = order.indexOf(hand2.cards[cardIndex])
        if (order1 < order2) {
          return 1 // hand2 first
        }
        if (order1 > order2) {
          return -1 // hand1 first
        }
      }
      console.error('Unable to determine order between ', hand1, hand2)
      return 0
    })

    return ordered.reduce((total, hand, index) => total + hand.bid * (index + 1), 0)
  }

  function detectWithoutJoker (perLabel) {
    if (Object.keys(perLabel).length === 1) {
      return TYPE_FIVE_OF_A_KIND
    }
    if (Object.keys(perLabel).length === 5) {
      return TYPE_HIGH_CARD
    }
    if (perLabel[maxSameCount] === 4) {
      return TYPE_FOUR_OF_A_KIND
    }
    if (perLabel[maxSameCount] === 3) {
      if (Object.keys(perLabel).length === 2) {
        return TYPE_FULL_HOUSE
      }
      return TYPE_THREE_OF_A_KIND
    }
    if (perLabel[maxSameCount] === 2) {
      if (Object.keys(perLabel).length === 3) {
        return TYPE_TWO_PAIRS
      }
      return TYPE_ONE_PAIR
    }
    console.error('Unable to determine type of ', perLabel)
    process.exit(-1)
  }

  yield buildSolution('AKQJT98765432', detectWithoutJoker)

  yield buildSolution('AKQT98765432J', function detectWithJoker (perLabel) {
    const numberOfJokers = perLabel.J ?? 0
    if (numberOfJokers === 0) {
      return detectWithoutJoker(perLabel)
    }
    if (Object.keys(perLabel).length === 1) {
      return TYPE_FIVE_OF_A_KIND
    }
    if (Object.keys(perLabel).length === 5) {
      // Joker replaces any of the 4 others
      return TYPE_ONE_PAIR
    }
    if (perLabel[maxSameCount] === 4) {
      // Either the Joker completes the 4 others OR we have 4 jokers
      return TYPE_FIVE_OF_A_KIND
    }
    if (perLabel[maxSameCount] === 3) {
      if (numberOfJokers === 2) {
        return TYPE_FIVE_OF_A_KIND
      }
      if (numberOfJokers === 1) {
        return TYPE_FOUR_OF_A_KIND
      }
      if (Object.keys(perLabel).length === 2) {
        return TYPE_FIVE_OF_A_KIND
      }
      if (numberOfJokers === 3) {
        return TYPE_FOUR_OF_A_KIND
      }
      // Nothing left (but no return to fail if I missed something)
    }
    if (perLabel[maxSameCount] === 2) {
      if (Object.keys(perLabel).length === 3) {
        if (numberOfJokers === 2) {
          return TYPE_FOUR_OF_A_KIND
        }
        return TYPE_FULL_HOUSE
      }
      // 4 different cards, either two jokers or the joker completes the pair
      return TYPE_THREE_OF_A_KIND
    }
    console.error('Unable to determine type of ', perLabel)
    return 0
  })
})
