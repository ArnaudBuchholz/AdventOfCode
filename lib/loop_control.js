class LoopControl {
  constructor (maxWaitMs, feedbackMs) {
    this._maxWait = maxWaitMs
    this._feedback = feedbackMs
    const now = Date.now()
    this._start = now
    this._last = now
    this._logs = 0
  }

  log (template, fields = {}) {
    const now = Date.now()
    ++this._logs
    if (now - this._start > this._maxWait) {
      throw new Error(`Interrupted after ${this._maxWait}ms`)
    }
    if (now - this._last > this._feedback) {
      this._last = now
      let msg = template
      Object.keys(fields).forEach(key => {
        msg = msg.replace(`{${key}}`, fields[key].toString())
      })
      const timeSpentInSecs = Math.floor((now - this._start) / 1000)
      const mins = Math.floor(timeSpentInSecs / 60).toString().padStart(2, '0')
      const secs = (timeSpentInSecs % 60).toString().padStart(2, '0')
      const meanLogs = Math.floor(this._logs / timeSpentInSecs)
      console.log(`${mins}:${secs}`, meanLogs, msg)
    }
  }

  get logCount () {
    return this._logs
  }
}

module.exports = {
  build (maxWaitMs = 5000, feedbackMs = 1000) {
    return new LoopControl(maxWaitMs, feedbackMs)
  }
}
