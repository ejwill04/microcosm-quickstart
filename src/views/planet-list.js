import React from 'react'
import ActionButton from 'microcosm/addons/action-button'
import {addPlanet} from '../actions/planets'

export default function PlanetList ({ planets = [] }) {

  return (
    <div>
      <ul>
        { planets.map(p => <li key={p}>{p}</li>)}
      </ul>

      <ActionButton action={addPlanet} value="Alpha Centauri">
        Add Planet
      </ActionButton>
    </div>
  )
}
