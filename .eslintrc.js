module.exports = {
  extends: ['./node_modules/@cowtech/eslint-config/react.js'],
  rules: {
    'react/jsx-filename-extension': [2, { extensions: ['.jsx'] }],
    'no-console': ['warn']
  },
  globals: {
    describe: true,
    test: true,
    expect: true,
    beforeEach: true,
    afterEach: true,
    beforeAll: true,
    afterAll: true,
    fetch: true
  }
}
