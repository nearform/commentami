module.exports = {
  extends: ['./node_modules/@cowtech/eslint-config/react.js'],
  rules: [
    "react/jsx-filename-extension": [2, { "extensions": [".jsx"] }]
  ]
  globals: {
    describe: true,
    test: true,
    expect: true,
    beforeEach: true,
    afterEach: true
  }
}
