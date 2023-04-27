import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';


// set up color scheme using tailwind shades extension
export const tokens = (mode) => ({
  ...(mode === 'dark'
    ? {
        gray: {
          100: '#f1f2f3',
          200: '#e3e5e7',
          300: '#d4d8da',
          400: '#c6cbce',
          500: '#b8bec2',
          600: '#93989b',
          700: '#6e7274',
          800: '#4a4c4e',
          900: '#252627',
        },

        // a primary dark color
        primary: {
          100: '#d0ced7',
          200: '#a09caf',
          300: '#716b88',
          // 400: '#413960',
          400: 'lightblue',
          500: '#120838',
          600: '#0e062d',
          700: '#0b0522',
          800: '#070316',
          900: '#04020b',
        },

        // an accent
        greenAccent: {
          100: '#d3f0d8',
          200: '#a7e1b1',
          300: '#7ad18a',
          400: '#4ec263',
          500: '#22b33c',
          600: '#1b8f30',
          700: '#146b24',
          800: '#0e4818',
          900: '#07240c',
        },

        // a dff accent
        yellowAccent: {
          100: '#f8f7d6',
          200: '#f1eeac',
          300: '#e9e683',
          400: '#e2dd59',
          500: '#dbd530',
          600: '#afaa26',
          700: '#83801d',
          800: '#585513',
          900: '#2c2b0a',
        },

        // another accent
        pinkAccent: {
          100: '#fbe4f7',
          200: '#f8c9ef',
          300: '#f4afe8',
          400: '#f194e0',
          500: '#ed79d8',
          600: '#be61ad',
          700: '#8e4982',
          800: '#5f3056',
          900: '#2f182b',
        },
      }
    : {
        gray: {
          100: '#252627',
          200: '#4a4c4e',
          300: '#6e7274',
          400: '#93989b',
          500: '#b8bec2',
          600: '#c6cbce',
          700: '#d4d8da',
          800: '#e3e5e7',
          900: '#f1f2f3',
        },

        // a primary dark color
        primary: {
          100: '#04020b',
          200: '#070316',
          300: '#0b0522',
          400: '#0e062d',
          500: '#120838',
          600: '#413960',
          700: '#716b88',
          800: '#a09caf',
          900: '#d0ced7',
        },

        // an accent
        greenAccent: {
          100: '#07240c',
          200: '#0e4818',
          300: '#146b24',
          400: '#1b8f30',
          500: '#22b33c',
          600: '#4ec263',
          700: '#7ad18a',
          800: '#a7e1b1',
          900: '#d3f0d8',
        },

        // a dff accent
        yellowAccent: {
          100: '#2c2b0a',
          200: '#585513',
          300: '#83801d',
          400: '#afaa26',
          500: '#dbd530',
          600: '#e2dd59',
          700: '#e9e683',
          800: '#f1eeac',
          900: '#f8f7d6',
        },

        // another accent
        pinkAccent: {
          100: '#2f182b',
          200: '#5f3056',
          300: '#8e4982',
          400: '#be61ad',
          500: '#ed79d8',
          600: '#f194e0',
          700: '#f4afe8',
          800: '#f8c9ef',
          900: '#fbe4f7',
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.gray[700],
              main: colors.gray[500],
              light: colors.gray[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.gray[700],
              main: colors.gray[500],
              light: colors.gray[100],
            },
            background: {
              default: '#fcfcfc',
            },
          }),
    },
    typography: {
      fontFamily: ['Roboto', 'sans-serif'].join(','),
      fontSize: 12,
      h1: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 40,
      },
      h2: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 32,
      },
      h3: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 24,
      },
      h4: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 20,
      },
      h5: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 16,
      },
      h6: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 14,
      },
    },
  };
};

// create a context so that we can have easy access to the condition of whether it's dark or light,
// and allow us to provide the function that changes it
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => 
        setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  );
  // create the theme from material UI and passing mode into our theme setting
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode] as const;
};
