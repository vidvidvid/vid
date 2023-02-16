import { extendTheme } from '@chakra-ui/react';
import { css } from '@emotion/react';

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
    main: '#2DF8C7',
    'green.100': '#2DF8C710',
    'green.200': '#2DF8C720',
    'green.300': '#2DF8C730',
    'green.400': '#2DF8C740',
    'green.500': '#2DF8C750',
    'green.600': '#2DF8C760',
    'green.700': '#2DF8C770',
    'green.800': '#2DF8C780',
    'green.900': '#2DF8C790',
    'green.950': '#2DF8C795',
    pending: '#EFFF8F',
    'yellow.100': '#EFFF8F10',
    'yellow.200': '#EFFF8F20',
    'yellow.300': '#EFFF8F30',
    'yellow.400': '#EFFF8F40',
    'yellow.500': '#EFFF8F50',
    'yellow.600': '#EFFF8F60',
    'yellow.700': '#EFFF8F70',
    'yellow.800': '#EFFF8F80',
    'yellow.900': '#EFFF8F90',
    'yellow.950': '#EFFF8F95',
    rejected: '#F43F5E',
    'purple.100': '#F43F5E10',
    'purple.200': '#F43F5E20',
    'purple.300': '#F43F5E30',
    'purple.400': '#F43F5E40',
    'purple.500': '#F43F5E50',
    'purple.600': '#F43F5E60',
    'purple.700': '#F43F5E70',
    'purple.800': '#F43F5E80',
    'purple.900': '#F43F5E90',
    'purple.950': '#F43F5E95',
    neutral: '#BCBCBC',
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

export const globalStyles = css`
  /* width */
  ::-webkit-scrollbar {
    width: 8px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #444444;
    border-radius: 2.5px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #2df8c7;
    border-radius: 2.5px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #1f7165;
  }
  body {
    scrollbar-color: #2df8c7 #444444;
    ::-webkit-scrollbar-track {
      background: #444444;
      border-radius: 0px;
    }
    overflow-y: scroll;
    background: #111312;
    overflow-x: hidden;
  }
  html,
  #__next {
    height: 100%;
  }
`;
