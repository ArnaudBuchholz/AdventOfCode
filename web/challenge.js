window.addEventListener('load', async () => {
  const $ = id => document.getElementById(id)

  const [, year, day] = location.search.match(/\?(\d+)(?:-(\d+))?/)
  document.title += ` ${year}`
  const links = $('links')

  if (!day) {
    $('year').innerHTML = year
    const yearChallenges = await fetch('../challenges.json')
      .then(response => response.json())
      .then(years => years[year])
    yearChallenges.forEach(day => {
      links.innerHTML += `<li class="nav-item"><a href="challenge.html?${year}-${day}" class="nav-link">${day}</a></li>`
    })
    $('content').innerHTML = '<p class="lead mb-4 text-center">Select a day.</p>'
    return
  }

  $('year').innerHTML = `${year} day ${day}`
  links.innerHTML += `<li class="nav-item">
  <div class="form-check mt-1 me-1">
    <input class="form-check-input" type="checkbox" value="" id="useSample">
    <label class="form-check-label" for="useSample">
      Use sample
    </label>
  </div>  
</li>
<li class="nav-item">
  <button id="run" class="btn btn-primary">&#9654;&#65039;</button>
</li>
<li class="nav-item">
  <a href="https://adventofcode.com/${year}/day/${day}" class="nav-link" target="_blank" rel="noopener noreferrer">source</a>
</li>`

  const [sample, input] = await Promise.all([
    fetch(`../${year}/sample/${day}.txt`).then(response => response.text()),
    fetch(`../${year}/input/${day}.txt`).then(response => response.text())
  ])

  let implementation
  window.require = function (path) {
    if (path !== '../challenge') {
      alert(`invalid require(${JSON.stringify(path)}) detected`)
      return
    }
    return function (callback) {
      implementation = callback
    }
  }

  const script = document.createElement('script')
  script.src = `../${year}/${day}.js`
  document.head.appendChild(script)

  function option ({ label, cmd }) {
    return false
  }

  const noop = () => {}
  const assert = new Proxy({
    strictEqual(a, b) {
      console.assert(a === b, `${JSON.stringify(a)} === ${JSON.stringify(b)}`)
    },
    notStrictEqual(a, b) {
      console.assert(a !== b, `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)
    }
  }, {
    get (obj, prop) {
      return obj[prop] || noop
    }
  })

  $('run').addEventListener('click', () => {
    $('content').innerHTML = ``
    const selectedInput = $('useSample').checked ? sample : input
    const lines = selectedInput.split(/\r?\n/).filter(line => !!line.trim())
    let numbers
    try {
      numbers = lines.map(Number)
    } catch (e) {
      numbers = []
    }
    const gen = implementation({
      input: selectedInput,
      lines,
      numbers,
      verbose: true,
      assert,
      option
    })
    const solutions = [...gen]
    solutions.forEach((solution, index) => {
      const line = document.createElement('div')
      line.appendChild(document.createTextNode(`Part ${index + 1}: ${solution}`))
      $('content').appendChild(line)
    })
  })
})
