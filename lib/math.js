function gcd (a, b) {
  if( b === 0 ) {
    return a
  }
  return gcd(b, a % b)
}

module.exports = {
  gcd (...numbers) {
    return numbers.reduce(gcd)
  }
}
