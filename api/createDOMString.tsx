import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider, StylesProvider, createGenerateClassName } from '@material-ui/styles'

import theme from '../app/src/theme'

export default function createDOMString(component, registry?: any) {
  const generateClassName = createGenerateClassName({productionPrefix: 'mm'})

  return ReactDOMServer.renderToString(
    <StylesProvider
      sheetsRegistry={registry}
      generateClassName={generateClassName}
    >
      <ThemeProvider theme={createMuiTheme(theme)}>
        {component}
      </ThemeProvider>
    </StylesProvider>
  )
}