const Option = require('./src/option');
const Util = require('./src/util');

/**
 *
 * Main argument parser class
 *
 */
class ArgParser {
  constructor() {
    this.options = [];
  }

  setDescription(description) {
    this.description = description;
    return this;
  }

  addOption(opt) {
    if (opt && opt.name !== '--help') {
      this.options.push(opt);
    }
    return this;
  }

  findOption(cmdArg) {
    return this.options.find(
      (opt) => opt.name === cmdArg || opt.alias === cmdArg
    );
  }

  help() {
    const scriptName = `./${Util.getScriptName()}`;
    if (this.description) {
      // eslint-disable-next-line no-console
      console.log(`\n  DESCRIPTION:\n\t${this.description}\n`);
    }

    // eslint-disable-next-line no-console
    console.log(`\n  USAGE:\n\t${scriptName} <OPTION> \n`);

    if (this.options) {
      // eslint-disable-next-line no-console
      console.log('\n  OPTIONS:\n\t ');
      // fix align for short alias option spaces column
      const names = this.options.map((opt) => opt.name || '');
      const aliases = this.options.map((opt) => opt.alias || '');

      const maxNameLength = Util.maxStringLength(names);
      const maxAliasLength = Util.maxStringLength(aliases);

      const fixAliasSpace = (n = '') => ' '.repeat(maxNameLength - n.length);
      const fixDescrSpace = (a = '') => ' '.repeat(maxAliasLength - a.length);

      this.options.forEach((opt) => {
        // no mutable string
        const { name = '', alias = '', description = '' } = opt;
        let fixAlias = '';
        let fixDescr = '';

        fixAlias = fixAliasSpace(name) + alias;
        fixDescr = fixDescrSpace(alias) + description;
        // eslint-disable-next-line no-console
        console.log(`\t${name}    ${fixAlias}    ${fixDescr}`);
      });

      // eslint-disable-next-line no-console
      console.log('\n');
    }
  }

  /**
   * Main Parser Method
   *
   * @returns {object} parsed model
   */
  parse() {
    this.options.push(new Option('--help').short('-h'));

    const out = {};
    const jsArgs = Util.getScriptArguments();

    let arg;
    let model;
    let errMsg;
    let outKey;

    if (jsArgs.length === 0) {
      this.help();
      Util.exit(0);
    }

    for (let i = 0; i < jsArgs.length; i += 1) {
      arg = ArgParser.parseArgument(jsArgs[i], jsArgs[i + 1]);
      model = this.findOption(arg.name);

      if (model.name === '--help') {
        this.help();
        Util.exit(0);
      }

      // --unknown-param
      if (!model) {
        errMsg = ` => Unknown option "${arg.name}"\n`;
        this.help();
        Util.exit(1, errMsg);
      }

      outKey = Util.normalizedParamName(model.name);
      if (model.type) {
        if (!arg.value) {
          errMsg = `ERROR: value is required for "${model.name}" parameter.`;
          Util.exit(1, errMsg);
        }
        out[outKey] = ArgParser.parseArgValue(model, arg.value);
        if (arg.slice) i += 1;
      } else if (arg.value) {
        errMsg = `ERROR: argument "${model.name}" not allow values.`;
        Util.exit(1, errMsg);
      } else {
        out[outKey] = true;
      }
    }

    // Check required arguments
    for (let i = 0; i < this.options.length; i += 1) {
      if (this.options[i].required) {
        outKey = Util.normalizedParamName(this.options[i].name);
        if (!out[outKey]) {
          errMsg = `ERROR: parameter "${this.options[i].name}" is required`;
          Util.exit(1, errMsg);
        }
      }
    }

    return out;
  }

  /**
   * Parse CommandLine argument.
   *
   * @static
   * @param {object} model user model configuration.
   * @param {string} value raw command line value
   * @returns {any} parsed value.
   */
  static parseArgValue(model, value) {
    if (!model || !model.type) {
      return value;
    }

    const isNaN = (val) => Number.isNaN(val);

    const exitForType = (msgType) => {
      const { name } = model;
      const msg = `ERROR:\n\tParameter "${name}" requires a valid ${msgType}.`;
      Util.exit(1, msg);
    };

    const pFloat = (raw) => {
      const res = parseFloat(raw);
      if (isNaN(res)) exitForType('float number');
      return res;
    };

    const pInt = (raw) => {
      const res = parseInt(raw, 10);
      if (isNaN(res)) exitForType('int number');
      return res;
    };

    const matchRegExp = (raw, regexp) => {
      const res = raw.match(regexp);
      if (!res || res.length < 1) {
        const strRegExp = regexp.toLocaleString();
        exitForType(`Regular Expression for "${strRegExp}"`);
      }
      return res;
    };

    let res;
    if (model.type instanceof RegExp) {
      res = matchRegExp(value, model.type);
    } else {
      switch (model.type) {
        case 'float':
          res = pFloat(value);
          break;
        case 'int':
          res = pInt(value);
          break;
        default:
          res = value;
      }
    }

    return res;
  }

  /**
   * Parse command line argument positional arg
   *
   * @static
   * @param {string} argName command line argument
   * @param {string } argValue raw command line value
   * @returns {object} name y value object
   */
  static parseArgument(argName, argValue) {
    const v = argName.split('=');
    const out = { name: v[0] };
    // --arg=val
    if (v.length > 1) {
      out.value = v.slice(1).join('=');
      // --arg value (positional)
    } else if (!Util.isParameter(argValue)) {
      out.value = argValue;
      out.slice = true;
    }
    return out;
  }
}

module.exports = {
  Option,
  ArgParser,
};