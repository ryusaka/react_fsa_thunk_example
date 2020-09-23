import * as React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { SheetsRegistry } from 'jss'
import { StaticRouter } from 'react-router'
import * as path from 'path'
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import { createMemoryHistory } from 'history'

import createDOMString from './createDOMString'

// WORKAROUND: muiがwindowがあるとclientと判定してuseLayoutEffectを使うのでSSRでは上書きする
Object.assign(React, {useLayoutEffect: React.useEffect})

export function renderApp(req, res) {
  const NodeExtractor = new ChunkExtractor({
    statsFile: path.resolve('api/app-dist/loadable-stats.json'),
    entrypoints: ['bundle'],
  })
  const extractor = new ChunkExtractor({
    statsFile: path.resolve('app/dist/loadable-stats.json'),
    entrypoints: ['main'],
  })
  const { reducer, App } = NodeExtractor.requireEntrypoint()

  const store = createStore(reducer(createMemoryHistory()), {}, applyMiddleware(thunk))
  const location = req.url
  const sheetsRegistry = new SheetsRegistry()
  const context = {}
  const body = createDOMString(
    <ChunkExtractorManager extractor={extractor}>
      <Provider store={store}>
        <StaticRouter location={location} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    </ChunkExtractorManager>,
    sheetsRegistry
  )

  const html = HTML({body, extractor, style: sheetsRegistry.toString(), initialData: {x: 'hoge hoge', user: {}}})
  res.send(html)
}

const serviceWorker = `
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register("/serviceWorker.js")
    })
  }
</script>
`
const HTML = ({body, extractor, style, initialData}) => {
  return `
<!doctype html>
<html lang="ja">
  <head>
    <style>${style}</style>
    ${serviceWorker}
  </head>
  <body>
    <div id="root">${body}</div>
    <script id="initial-data">window.__STATE__=${JSON.stringify(initialData).replace(/</g, '\\u003c')}</script>${extractor.getScriptTags()}
  </body>
</html>
`
}