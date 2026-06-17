import config from '@verdictx/eslint-config/react';

export default [
  ...config,
  {
    ignores: ['eslint.config.js', 'prettier.config.js'],
  },
];
