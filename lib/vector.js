module.exports = {
  encode (v) {
    return v.join(',')
  },

  decode (e) {
    return e.split(',').map(Number)
  }
}
