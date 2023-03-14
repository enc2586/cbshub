import { createTheme, PaletteOptions, ThemeOptions } from '@mui/material'

import { koKR } from '@mui/x-data-grid'
import { koKR as pickerskoKR } from '@mui/x-date-pickers'
import { koKR as corekoKR } from '@mui/material/locale'

declare module '@mui/material/styles' {
  interface Palette {
    secondaryBackground: Palette['primary']
  }
  interface PaletteOptions {
    secondaryBackground: PaletteOptions['primary']
  }
}

const defaultTheme: ThemeOptions = {
  typography: {
    fontFamily: 'Pretendard',
    h1: {
      fontWeight: 'bold',
    },
    h2: {
      fontWeight: 'bold',
    },
    h3: {
      fontWeight: 'bold',
    },
    h4: {
      fontWeight: 'bold',
    },
    h5: {
      fontWeight: 'bold',
    },
    h6: {
      fontWeight: 'bold',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
  palette: {
    primary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    secondary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondaryBackground: {
      main: '#e0e0e0',
      contrastText: '#000000',
    },
  },
}

export const lightTheme = createTheme(
  defaultTheme,
  koKR, // x-data-grid translations
  pickerskoKR, // x-date-pickers translations
  corekoKR, // core translations
)

export const darkTheme = createTheme(
  {
    ...defaultTheme,
    palette: {
      ...defaultTheme.palette,
      secondaryBackground: {
        main: '#424242',
        contrastText: '#ffffff',
      },
      mode: 'dark',
    } as PaletteOptions,
  },
  koKR, // x-data-grid translations
  pickerskoKR, // x-date-pickers translations
  corekoKR, // core translations
)
