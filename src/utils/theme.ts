import { extendTheme } from '@chakra-ui/react';

const Input = {
  variants: {
    outline: {
      field: {
        _focus: {
          borderColor: 'transparent',
          boxShadow: '0px 0px 0px 2px #AD90FF',
        },
      },
    },
  },
};

const Button = {
  baseStyle: { borderRadius: 'full' },
};

const Form = {
  baseStyle: { container: { padding: '2px' } },
};

export const theme = extendTheme({
  breakpoints: {
    '3xl': '108em',
    '2xl': '96em',
    base: '0em',
    lg: '62em',
    md: '48em',
    sm: '30em',
    xl: '80em',
  },
  sizes: {
    '9xl': '108rem',
    '10xl': '120em',
  },
  fonts: {
    heading: `'Museo Moderno', sans-serif`,
    headingLight: `'Museo Moderno Light', sans-serif`,
    // body: `'Baumans Regular', sans-serif`,
  },
  colors: {
    green: {
      '50': '#eafef9',
      '100': '#befdee',
      '200': '#9efce5',
      '300': '#72fad9',
      '400': '#57f9d2',
      '500': '#2df8c7',
      '600': '#29e2b5',
      '700': '#20b08d',
      '800': '#19886d',
      '900': '#136854',
    },
    purple: {
      '50': '#f9eafe',
      '100': '#eebefd',
      '200': '#e59efc',
      '300': '#d972fa',
      '400': '#d257f9',
      '500': '#c72df8',
      '600': '#b529e2',
      '700': '#8d20b0',
      '800': '#6d1988',
      '900': '#541368',
    },
    yellow: {
      '50': '#fef9ea',
      '100': '#fdeebe',
      '200': '#fce59e',
      '300': '#fad972',
      '400': '#f9d257',
      '500': '#f8c72d',
      '600': '#e2b529',
      '700': '#b08d20',
      '800': '#886d19',
      '900': '#685413',
    },
  },
  shadows: {
    outline: '0px 0px 0px 2px #AD90FF',
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  components: {
    Input,
    Button,
    Form,
  },
});
