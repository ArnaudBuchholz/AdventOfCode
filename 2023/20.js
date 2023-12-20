require('../challenge')(async function * ({
  lines,
  isSample,
  verbose
}) {
  const { build: buildLoopControl } = await require('../lib/loop_control')

  class Component {
    static #map = {}

    static setup () {
      lines.forEach(line => {
        const [, type, name, links] = line.match(/^(%|&)?(\w+) -> (.*)$/)
        let Type
        if (type === '%') {
          Type = FlipFlop
        } else if (type === '&') {
          Type = Conjunction
        } else if (name === 'broadcaster') {
          Type = Broadcaster
        } else {
          throw new Error(`Unexpected input : ${line}`)
        }
        const component = new Type(name, links.split(', '))
        Component.add(component)
      })
      Component.connectAll()
    }

    static get broadcaster () {
      return this.#map.broadcaster
    }

    static add (component) {
      this.#map[component.name] = component
    }

    static get (name) {
      return this.#map[name]
    }

    static forEach (callback) {
      Object.values(this.#map).forEach(callback)
    }

    static connectAll () {
      Component.forEach(component => {
        component.#links.forEach(name => {
          let linkedComponent = Component.#map[name]
          if (linkedComponent === undefined) {
            linkedComponent = new Silent(name, [])
            Component.add(linkedComponent)
          }
          component.#connections.push(linkedComponent)
          linkedComponent.addInput(component.name)
        })
      })
    }

    static reset () {
      Component.forEach(component => {
        component.reset()
        delete component.pulse
      })
    }

    static report () {
      Object.values(this.#map)
        .forEach(component => {
          console.log(`${component.name} (${component.type}) ${component.report()} :`)
          for (const connection of component.connections) {
            console.log(`    ➜ ${connection.name} (${connection.type})`)
          }
        })
    }

    static state () {
      return Object.values(this.#map).map(component => component.state()).join(',')
    }

    #name = ''
    #links = []
    #connections = []

    constructor (name, links) {
      this.#name = name
      this.#links = links
      this.#connections = []
    }

    get name () {
      return this.#name
    }

    get type () {
      return this.constructor.name
    }

    get connections () {
      return [...this.#connections]
    }

    addInput (name) {}

    reset () {}

    state () {}

    report () {
      return '<Component Report>'
    }

    pulse (from, high) {
      return this.generatePulses(high)
    }

    generatePulses (high) {
      return this.#connections.map(connection => {
        return {
          from: this.#name,
          to: connection.name,
          pulse: high
        }
      })
    }
  }

  class FlipFlop extends Component {
    #stateOn = false

    pulse (_, high) {
      if (!high) {
        this.#stateOn = !this.#stateOn
        return this.generatePulses(this.#stateOn)
      }
      return []
    }

    reset () {
      this.#stateOn = false
    }

    state () {
      return this.#stateOn ? '1' : '0'
    }

    report () {
      return JSON.stringify({ state: this.#stateOn })
    }
  }

  class Conjunction extends Component {
    #inputs = {}

    constructor (name, links) {
      super(name, links)
      this.#inputs = {}
    }

    pulse (from, high) {
      this.#inputs[from] = high
      const allHigh = Object.values(this.#inputs).reduce((last, value) => last && value, true)
      return this.generatePulses(!allHigh)
    }

    addInput (name) {
      this.#inputs[name] = false
    }

    reset () {
      Object.keys(this.#inputs).forEach(input => {
        this.#inputs[input] = false
      })
    }

    state () {
      return Object.keys(this.#inputs).map(input => this.#inputs[input] ? input : undefined).join('|')
    }

    report () {
      return JSON.stringify(this.#inputs)
    }
  }

  class Broadcaster extends Component {
    report () {
      return ''
    }
  }

  class Silent extends Component {
    pulse () {
      return []
    }

    report () {
      return ''
    }
  }

  Component.setup()
  if (verbose) {
    Component.report()
  }

  const { broadcaster } = Component
  function pushButton () {
    const signals = broadcaster.pulse('button', false)
    while (signals.length) {
      const { from, to, pulse } = signals.shift()
      if (verbose) {
        console.log(`${from} -${pulse ? 'high' : 'low'}-> ${to}`)
      }
      const toComponent = Component.get(to)
      const subSignals = toComponent.pulse(from, pulse)
      for (const signal of subSignals) {
        signals.push(signal)
      }
    }
  }

  let [totalLow, totalHigh] = [0, 0]
  Component.forEach(component => {
    const pulse = component.pulse
    component.pulse = function (from, high) {
      if (high) {
        ++totalHigh
      } else {
        ++totalLow
      }
      return pulse.call(this, from, high)
    }
  })
  for (let i = 0; i < 1000; ++i) {
    pushButton()
  }
  yield totalLow * totalHigh

  if (isSample) {
    return
  }

  Component.reset()
  let [rxLowPulse, rxHighPulse] = [0, 0]
  // let states = new Set()
  Component.get('rx').pulse = function (_, high) {
    if (high) {
      ++rxHighPulse
    } else {
      ++rxLowPulse
    }
    return []
  }
  let pressCount = 0
  const loop = buildLoopControl(Number.POSITIVE_INFINITY)
  // eslint-disable-next-line no-unmodified-loop-condition
  while (rxLowPulse === 0) {
    loop.log('Pressed button {pressCount} times ({rxLowPulse}/{rxHighPulse})...', {
      pressCount,
      rxLowPulse,
      rxHighPulse
    })
    ++pressCount
    pushButton()
    // const state = Component.state()
    // if (states.has(state)) {
    //   throw new Error('State already existing')
    // }
    // states.add(state)
  }
  yield pressCount
})
