/* global location */

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
  <button id="run" class="btn btn-primary">&#9654;</button>
</li>
<li class="nav-item">
  <a href="https://adventofcode.com/${year}/day/${day}" class="nav-link" target="_blank" rel="noopener noreferrer">challenge</a>
</li>
<li class="nav-item">
  <a href="https://github.com/ArnaudBuchholz/AdventOfCode/blob/main/${year}/${day}.js" class="nav-link" target="_blank" rel="noopener noreferrer">solution</a>
</li>`

  const [sample, input] = await Promise.all([
    fetch(`../${year}/sample/${day}.txt`).then(response => response.text()),
    fetch(`../${year}/input/${day}.txt`).then(response => response.text())
  ])

  let implementation
  const modules = {}
  window.require = function (path) {
    if (path === '../challenge') {
      return function (callback) {
        implementation = callback
      }
    }
    if (modules[path]) {
      return Promise.resolve(modules[path])
    }
    window.module = {}
    const script = document.createElement('script')
    script.src = `${path}.js`
    document.head.appendChild(script)
    return new Promise(resolve => {
      script.addEventListener('load', () => {
        modules[path] = window.module.exports
        resolve(modules[path])
      })
    })
  }

  const mainScript = document.createElement('script')
  mainScript.src = `../${year}/${day}.js`
  document.head.appendChild(mainScript)

  function option ({ label, cmd }) {
    return false
  }

  const noop = () => {}
  const assert = new Proxy({
    strictEqual (a, b, message) {
      console.assert(a === b, message || `${JSON.stringify(a)} === ${JSON.stringify(b)}`)
    },
    notStrictEqual (a, b, message) {
      console.assert(a !== b, message || `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)
    },
    ok (bool, message) {
      console.assert(bool, message || 'OK')
    }
  }, {
    get (obj, prop) {
      return obj[prop] || noop
    }
  })

  async function run () {
    $('content').innerHTML = ''
    const isSample = $('useSample').checked
    const selectedInput = isSample ? sample : input
    const lines = selectedInput.split(/\r?\n/).filter(line => !!line.trim())
    let numbers
    try {
      numbers = lines.map(Number)
    } catch (e) {
      numbers = []
    }
    const genSolutions = implementation({
      isSample,
      input: selectedInput,
      lines,
      numbers,
      verbose: true,
      assert,
      option
    })
    const solutions = []
    for await (const solution of genSolutions) {
      solutions.push(solution)
    }
    solutions.forEach((solution, index) => {
      const line = document.createElement('div')
      line.appendChild(document.createTextNode(`Part ${index + 1}: ${solution}`))
      $('content').appendChild(line)
    })
  }

  $('run').addEventListener('click', run)

  if (!location.toString().startsWith('http://localhost')) {
    mainScript.addEventListener('load', () => {
      $('useSample').checked = true
      run()
    })
  }
})
