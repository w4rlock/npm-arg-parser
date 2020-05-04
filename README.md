[![npm version](https://badge.fury.io/js/n-arg-parser.svg)](https://badge.fury.io/js/n-arg-parser)
[![npm downloads](https://img.shields.io/npm/dt/n-arg-parser.svg?style=flat)](https://www.npmjs.com/package/n-arg-parser)

### INSTALLATION
```bash
npm i -E n-arg-parser
```

### FEATURES
```yaml
Auto Parser Argument Value.
- Int.
- Float.
- String.
- Regular Expresion (custom).

- Auto Generate Help.
- Required fields.
- Fail on Unknown options and show help.
- Friendly messages.
- No externals libs.
- Easy Builder User Model Configuration.
```

### USAGE
```js
const { ArgParser, Option } = require('n-arg-parser');

const opts = new ArgParser()
  .setDescription('Test Argument Parser')
  .addOption(new Option('--arg-int').desc('test int').int().isRequired())
  .addOption(new Option('--arg-float') .desc('test float').float())
  .addOption(new Option('--arg-string').string().short('-s'))
  .addOption(new Option('--arg-regexp').regexp(/\d{2}/).desc('test 2 numbers regexpr').isRequired())
  .parse();

console.log(JSON.stringify(opts));

// OUTPUT RESULT
/*
{
  "argint": 12,
  "argfloat": 12,
  "argregexp": [
    "21"
  ]
}
*/

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
        --arg-regexp          test 2 numbers regexpr
        --arg-string    -s
        --help          -h

```
### VALIDATIONS

```bash
$ node example.js --arg-idsad
  ERROR: unknown option "--arg-idsad"


$ node example.js --arg-int aaa
  ERROR: parameter "--arg-int" requires a valid int number.


$ node example.js --arg-int 22
  ERROR: parameter "--arg-regexp" is required.


$ node example.js --arg-int 12 --arg-regexp aa
  ERROR: parameter "--arg-regexp" requires a valid Regular Expression for "/\d{2}/".

$ node example.js --arg-int 12 --arg-regexp 22
{
  "argint": 12,
  "argregexp": [ "22" ]
}
```
