#!/usr/bin/env node
const parse = require('./index');

const opts = parse([
  { name: '--remove', short: '-r' },
  { name: '--test-int', short: '-ti', value: { type: 'int' } },
  { name: '--test-float', value: { type: 'float' } },
  { name: '--test-string', value: { type: 'string' } },
  { name: '--test-regexpr-int', value: { type: /[0-9]+/g } },
]);

// eslint-disable-next-line no-console
console.log(JSON.stringify(opts));