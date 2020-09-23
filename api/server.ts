import 'source-map-support/register' // support stack trace on ts file
const path = require('path')
const express = require('express')
const app = express()
app.listen(3000, () => console.log('listen 3000'))

// webpack
const webpackConfig = require(path.resolve('./app/webpack.config.js'))
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')
const compiler = webpack(webpackConfig)
app.use(
  webpackDevMiddleware(compiler, {
    logLevel: 'error',
    publicPath: webpackConfig.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      ignored: [/node_modules/, /dist\//],
    },
    writeToDisk(filePath) {
      return /(dist\/|loadable-stats)/.test(filePath)
    },
  })
)
app.use(
  webpackHotMiddleware(compiler)
)

app.get('/', (req, res) =>
  res.sendFile(path.resolve(__dirname, './index.html'))
)

app.get('/wait1000', async (req, res) => {
  if (req.query.text === 'error') return res.status(404).json({message: 'error!!'})
  await new Promise(r => setTimeout(r, 1000))
  res.json({response: 'Thank you for waiting!!!'})
})

app.get('/test', require('./ssr').renderApp)