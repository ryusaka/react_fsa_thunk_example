import { ThemeOptions, } from '@material-ui/core/styles/createMuiTheme'

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: '#1180cc',
    },
    secondary: {
      main: '#8FC320',
      contrastText: '#ffffff',
    },
  },
  breakpoints: {
    keys: [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
    ],
    values: {
      xs: 0,
      sm: 768,
      md: 992,
      lg: 1000000000,
      xl: 1000000000,
    },
  },
}

export default theme
