[![npm version](https://badge.fury.io/js/n-arg-parser.svg)](https://badge.fury.io/js/n-arg-parser)
[![npm downloads](https://img.shields.io/npm/dt/n-arg-parser.svg?style=flat)](https://www.npmjs.com/package/n-arg-parser)

### Installation
```bash
npm i -g n-arg-parser
```

### Features
```yaml
Auto Parser For Argument Value.
- Int.
- Float.
- String.
- RegExp (custom).

Features
- Print Help.
- Skip Unknown options and show help.
- Friendly messages.
- No externals libs.
- Simple Configuration.

```

### USAGE
```js
const parse = require('n-arg-parser');
const opts = parse([
  { name: "--remove", short: "-r" },
  { name: "--test-int", short: '-ti', value: { type: "int" } },
  { name: "--test-float", value: { type: "float" } },
  { name: "--test-string", value: { type: "string" } },
  { name: "--test-regexpr-int", value: { type: /[0-9]+/g } }
]);

console.log(JSON.stringify(opts));
```
