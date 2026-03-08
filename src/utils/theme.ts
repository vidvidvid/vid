import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: `'Sono', sans-serif` },
      },
      colors: {
        green: {
          '50': { value: '#eafef9' },
          '100': { value: '#befdee' },
          '200': { value: '#9efce5' },
          '300': { value: '#72fad9' },
          '400': { value: '#57f9d2' },
          '500': { value: '#2df8c7' },
          '600': { value: '#29e2b5' },
          '700': { value: '#20b08d' },
          '800': { value: '#19886d' },
          '900': { value: '#136854' },
        },
        purple: {
          '50': { value: '#f9eafe' },
          '100': { value: '#eebefd' },
          '200': { value: '#e59efc' },
          '300': { value: '#d972fa' },
          '400': { value: '#d257f9' },
          '500': { value: '#c72df8' },
          '600': { value: '#b529e2' },
          '700': { value: '#8d20b0' },
          '800': { value: '#6d1988' },
          '900': { value: '#541368' },
        },
        yellow: {
          '50': { value: '#fef9ea' },
          '100': { value: '#fdeebe' },
          '200': { value: '#fce59e' },
          '300': { value: '#fad972' },
          '400': { value: '#f9d257' },
          '500': { value: '#f8c72d' },
          '600': { value: '#e2b529' },
          '700': { value: '#b08d20' },
          '800': { value: '#886d19' },
          '900': { value: '#685413' },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
