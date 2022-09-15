window.addEventListener('load', async () => {
  const challenges = await fetch('challenges.json').then(response => response.json())
  const years = document.getElementById('years')
  Object.keys(challenges)
    .sort()
    .forEach(year => {
      years.innerHTML += `<li class="nav-item"><a href="year.html?${year}" class="nav-link">${year}</a></li>`
    })
})
