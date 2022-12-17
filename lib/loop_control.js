class LoopControl {
  constructor (maxWaitMs, feedbackMs) {
    this._maxWait = maxWaitMs
    this._feedback = feedbackMs
    const now = Date.now()
    this._start = now
    this._last = now
  }

  log (template, fields) {
    const now = Date.now()
    if (now - this._start > this._maxWait) {
      throw new Error(`Interrupted after ${this._maxWait}ms`)
    }
    if (now - this._last > this._feedback) {
      this._last = now
      let msg = template
      Object.keys(fields).forEach(key => {
        msg = msg.replace(`{${key}}`, fields[key].toString())
      })
      console.log(msg)
    }
  }
}

module.exports = (maxWaitMs = 5000, feedbackMs = 1000) => new LoopControl(maxWaitMs, feedbackMs)
