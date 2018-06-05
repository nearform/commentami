'use strict'

module.exports = {
  collectCoverageFrom: ['src/**/*.js', 'src/**/*.jsx'],
  coveragePathIgnorePatterns: ['node_modules', 'src/index.js', 'src/ui.js'],
  coverageReporters: ['text', 'html'],
  testMatch: ['**/*.test.js', '**/*.test.jsx'],
  setupTestFrameworkScriptFile: './test/config.js'
}
