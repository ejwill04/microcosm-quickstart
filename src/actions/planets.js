export function getPlanets() {

  // This isn't *really* an AJAX request, but it
  // accomplishes what we want...
  return new Promise(function (resolve, reject) {
    resolve([
      'Mercury', 'Venus', 'Earth', 'Mars',
      'Jupiter', 'Saturn', 'Uranus', 'Neptune',
      'Pluto'
    ])
  })
}

export function addPlanet (planet) {
  return planet
}
