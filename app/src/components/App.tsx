import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from '@loadable/component'

const Hello = loadable(() => import('./Hello').then(({Hello}) => Hello))
const Lazy = loadable(() => import('./Lazy').then(({Lazy}) => Lazy))

const App = () => {
  return (
    <Switch>
      <Route exact path='/lazy' component={Lazy} />
      <Route exact path='/test' component={Hello} />
      <Route exact path='/' component={Hello} />
    </Switch>
  )
}

export default App
