import React from 'react'
import Presenter from 'microcosm/addons/presenter'
import PlanetList from '../views/planet-list'
import {getPlanets} from '../actions/planets'

class Planets extends Presenter {

  setup (repo) {
    repo.push(getPlanets)
  }

  getModel () {
    return {
      planets: state => state.planets
    }
  }

  render () {
    const { planets } = this.model

    return <PlanetList planets={planets} />
  }

}

export default Planets
