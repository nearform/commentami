module.exports = {
  extends: [
    'standard',
    'standard-jsx',
    'standard-react',
    'prettier/react',
    'prettier/standard'
  ],
  rules: {
    // This is inserted to make this compatible with prettier.
    curly: 0,
    'no-console': ['warn'],
    /*
      This is inserted to make this compatible with prettier.
      Once https://github.com/prettier/prettier/issues/3845 and https://github.com/prettier/prettier/issues/3847 are solved this might be not needed any more.
    */
    'space-before-function-paren': 0,
    // Remove once we introduce it
    'react/prop-types': 0,
    // This is because usually double quotes are more common in HTML/JSX tags
    'jsx-quotes': [2, 'prefer-double'],
    // Let's make sure all JSX is clearly indicated by file extension
    'react/jsx-filename-extension': [2, { extensions: ['.jsx'] }]
  },
  globals: {
    // DOM API
    fetch: true,
    // Jest / Lab
    jest: true,
    describe: true,
    test: true,
    expect: true,
    beforeEach: true,
    afterEach: true,
    beforeAll: true,
    afterAll: true
  }
}
