const { ArgParser, Option } = require('./index');

const opts = new ArgParser()
  .setDescription('Test Argument Parser')
  .addOption(new Option('--arg-int').desc('test int').int().isRequired())
  .addOption(new Option('--arg-float') .desc('test float').float())
  .addOption(new Option('--arg-string').string().short('-s'))
  .addOption(new Option('--arg-regexp').regexp(/\d{2}/).desc('test 2 numbers regexpr').isRequired())
  .parse();

// eslint-disable-next-line no-console
console.log(JSON.stringify(opts, null , 2));