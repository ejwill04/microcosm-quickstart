# Quickstart

This guide will teach you how to build a simple app using
[Microcosm](https://github.com/vigetlabs/microcosm) and
[React](https://github.com/facebook/react).

We'll cover these steps:

1. Project setup
2. Define a route
3. Define a presenter
4. Define a store
5. Define an action

## Project setup

Let's clone the `microcosm-starter` repo and install
dependencies. Type these commands into your terminal:

```bash
git clone https://github.com/nhunzaker/microcosm-starter
cd microcosm-starter
npm install
```

Don't have npm? [Learn how to install Node.js and npm here](https://docs.npmjs.com/getting-started/installing-node).

#### Working your way around the application ####

The starter project will come with everything you need to get started
with Microcosm. This also includes a project structure:

```none
src/
├── actions
├── presenters
├── stores
├── style
├── views
├── index.js
├── repo.js
└── routes.js
```

We follow the
[Model View Presenter (MVP) pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter)
for our projects. Don't worry about that too much now, we'll cover it
as we build out a quick application.

### Launch the app

Run the following command in your terminal:

```bash
npm start
```

(To stop the server at any time, type Ctrl-C in your terminal.)

This will probably open your default browser to a new tab at
[http://localhost:3000](http://localhost:3000). Congratulations! You
just created and booted your first Microcosm app!

### Personalize it

The current site copy is cheerful, but a little too generic. This text
lives inside of the generic layout file.

Let's update it, open `src/views/layout.js`

```javascript
// src/views/layout.js
import React from 'react'

export default function Layout ({children}) {

  return (
    <div>
      <h1>Solar System</h1>
      {children}
    </div>
  )
}
```

Foreshadowing things to come...

## Define a route

Let's build an application that shows a list of planets. We'll place
that content in an index route, which will display when a user visits
the homepage

We use [`react-router`](https://github.com/reactjs/react-router) for
routing. It's already included in `microcosm-starter`, so let's
go ahead and add an index route.

Crack open `src/routes.js` and edit it to look like:

```javascript
// src/routes.js
import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from './presenters/application'
import Planets from './presenters/planets'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Planets} />
  </Route>
)
```

Your build process is probably yelling at you right now with something
like:

```bash
Error in ./src/routes.js
Module not found: ./presenters/planets in ~/microcosm-starter/src
```

That's because we haven't added a presenter yet. We'll do that next.

## Define a presenter

Presenters are just special React components that are charged with
higher levels of responsibility. We make a distinction between them
and "passive view" components for a couple of reasons:

1. Presenters provide an answer for where keep data operations and
   dispatch application actions.
2. Presenters are a gateway. They keep application concerns outside of
   the majority of the presentation layer.
3. Testing and refactoring are significantly easier because everything
   in `src/views` is isolated. It has no idea how the application
   works.

Let's create a presenter! Make a new JavaScript file at
`src/presenters/planets.js`:

```javascript
// src/presenters/planets.js
import React from 'react'
import Presenter from 'microcosm/addons/presenter'

class Planets extends Presenter {

  render() {
    return (
      <ul>
        <li>Mercury</li>
        <li>Venus</li>
        <li>Earth</li>
        <li>Mars</li>
        <li>Jupiter</li>
        <li>Saturn</li>
        <li>Uranus</li>
        <li>Pluto</li>
      </ul>
    )
  }

}

export default Planets
```

Now we see a list of planets! Now you might be asking yourself:

> You said that Presenters isolate the view layer from the
> application. Where's the separation?

And you'd be correct! Let's make a planets list view component. Create
a new React component at `src/views/planet-list.js`:

```javascript
// src/views/planet-list.js
import React from 'react'

export default function PlanetList () {

  return (
    <ul>
      <li>Mercury</li>
      <li>Venus</li>
      <li>Earth</li>
      <li>Mars</li>
      <li>Jupiter</li>
      <li>Saturn</li>
      <li>Uranus</li>
      <li>Pluto</li>
    </ul>
  )
}
```

Then update the Planets presenter to use this new view component:

```javascript
// src/presenters/planets.js
import React from 'react'
import Presenter from 'microcosm/addons/presenter'
import PlanetList from '../views/planet-list'

class Planets extends Presenter {

  render() {
    return <PlanetList />
  }

}

export default Planets

```

Awesome. Well, not _really_. Now the `PlanetList` view components knows
all about the data. It shouldn't care whether or not Pluto's a _real_
planet. Let's fix that.

We need to prepare data in the presenter to send down into the
view. Presenters can implement a `viewModel` method that to do just
that:

```javascript
// src/presenters/planets
import React from 'react'
import Presenter from 'microcosm/addons/presenter'
import PlanetList from '../views/planet-list'

class Planets extends Presenter {

  viewModel() {
    return {
      planets: () => ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    }
  }

  render() {
    return <PlanetList planets={this.state.planets} />
  }

}

export default Planets
```

And in our PlanetList:

```javascript
// src/views/planet-list.js
import React from 'react'

export default function PlanetList ({ planets = [] }) {

  return (
    <ul>
      { planets.map(p => <li key={p}>{p}</li>)}
    </ul>
  )
}
```

Much better.

## Defining a store

We can do better. Application data really belongs in Microcosm. To do
this, we need to make a Planets store. Create a new JavaScript file at
`./src/stores/planets.js`:

```javascript
// src/stores/planets.js
const Planets = {

  getInitialState() {
    return [
      'Mercury', 'Venus', 'Earth', 'Mars',
      'Jupiter', 'Saturn', 'Uranus', 'Neptune',
      'Pluto'
    ]
  }

}

export default Planets
```

We call instances of Microcosm _repos_. An isolated warehouse to
manage application state. Hooking up the planets store is easy:

```javascript
// src/repo.js
import Microcosm from 'microcosm'
import Planets from './stores/planets'

class Repo extends Microcosm {

  constructor(options) {
    super(options)

    this.addStore('planets', Planets)
  }

}

export default Repo
```

Here we're saying, "Mount the Planets store to `'planets'`." it will
managing everything under `repo.state.planets`.

We can subscribe to that in our Planets presenter. Open it up once
more:

```javascript
import React from 'react'
import Presenter from 'microcosm/addons/presenter'
import PlanetList from '../views/planet-list'

class Planets extends Presenter {

  viewModel() {
    return {
      // I'm new. Pull planets out of the repo's state
      planets: state => state.planets
    }
  }

  render() {
    return <PlanetList planets={this.state.planets} />
  }

}

export default Planets
```

Cool. Each value in the key/value map returned from `viewModel` is
processed by the Presenter. When given a function, it will invoke it
with the current application state.

Awesome. Nice and separated.

## Defining an action

Let's simulate what would happen if you were working with a planets
API. In this case, the Planets store wouldn't know about all of the
planets right on start-up. We need to fetch information from a server.

Microcosm actions are responsible for dealing with asynchronous
state. Let's move the data inside of planets out into an action:

```javascript
// src/actions/planets.js
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
```

And in the Planet's store, subscribe to it using the `register()`
function:

```javascript
// src/stores/planets.js
import {getPlanets} from '../actions/planets'

const Planets = {
  getInitialState() {
    // Remember, we put the planets data into the action
    return []
  },

  append(planets, data) {
    return planets.concat(data)
  },

  register() {
    return {
      // Curious? This works because Microcosm assigns a unique
      // toString() method to each action pushed into it. That means
      // the action can be used as a unique key in an object.
      [getPlanets]: this.append
    }
  }
}

export default Planets
```

You might have noticed that the planets went missing from the page. Of
course! We aren't asking for them.

Let's use the Presenter's `presenterWillMount` lifecycle hook to fetch
the planet data.

`presenterWillMount` is given the current `repo` for the presenter
specifically for this purpose:

```javascript
// src/presenters/planets.js
import React from 'react'
import Presenter from 'microcosm/addons/presenter'
import PlanetList from '../views/planet-list'
import {getPlanets} from '../actions/planets'

class Planets extends Presenter {

  presenterWillMount(repo) {
    repo.push(getPlanets)
  }

  viewModel() {
    return {
      planets: state => state.planets
    }
  }

  render() {
    return <PlanetList planets={this.state.planets} />
  }

}

export default Planets
```

And we're back! When the router is about to mount the Planets
presenter to the page, it will call `presenterWillMount`. This will
cause a `getPlanets` to get queued up with the application's repo.

Microcosm will process the action, sending updates to the stores who
indicate they want to get updates based on their `register` function.

## Wrapping up

That's it! You've just gone through a whirlwind tour of Microcosm and
our preferred architecture. Happy trailblazing!
