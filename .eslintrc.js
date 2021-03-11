module.exports = {
  extends: [
    'eslint:all',
    'plugin:@typescript-eslint/all',
  ],
  parserOptions: {
    project: './tsconfig.json',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
  ignorePatterns: ['/*.*'],
};
