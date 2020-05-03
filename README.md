[![npm version](https://badge.fury.io/js/n-arg-parser.svg)](https://badge.fury.io/js/n-arg-parser)
[![npm downloads](https://img.shields.io/npm/dt/n-arg-parser.svg?style=flat)](https://www.npmjs.com/package/n-arg-parser)

### INSTALLATION
```bash
npm i -g n-arg-parser
```

### FEATURES
```yaml
Auto Parser For Argument Value.
- Int.
- Float.
- String.
- RegExp (custom).

Features
- Print Help.
- Fail on Unknown options and show help.
- Friendly messages.
- No externals libs.
- Simple User Model Configuration.
```

### USAGE
```js
const { ArgParser, Option } = require('./index');

const opts = new ArgParser()
  .setDescription('Test Argument Parser')
  .addOption(new Option('--arg-int').desc('test int').int().isRequired())
  .addOption(new Option('--arg-float') .desc('test float').float())
  .addOption(new Option('--arg-string').string().short('-s'))
  .addOption(new Option('--arg-regexp').regexp(/\d{2}/).desc('test 2 numbers regexpr').isRequired())
  .parse();

console.log(JSON.stringify(opts));
```

### RUN EXAMPLE

```bash
$ node example.js --help

  DESCRIPTION:
        Test Argument Parser


  USAGE:
        ./example.js <OPTION>


  OPTIONS:

        --arg-int             test int
        --arg-float           test float
        --arg-string    -s
        --arg-regexp          test 2 numbers regexpr
        --help          -h

```
