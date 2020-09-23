import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import axios from 'axios'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import { Router } from 'react-router'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'

import reducer from './reducers/index'
import theme from './theme'
import App from './components/App'

const Root = () => {
  return (
    <MuiThemeProvider theme={createMuiTheme(theme)}>
      <Provider store={store}>
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    </MuiThemeProvider>
  )
}

const client = axios.create()
const thunkWithClient = thunk.withExtraArgument(client)
const composeEnhancers = process.env.TARGET_ENV === 'production' ? compose : (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose)

const history = createBrowserHistory()
const store = createStore(reducer(history), {}, composeEnhancers(applyMiddleware(thunkWithClient, routerMiddleware(history))))

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)
