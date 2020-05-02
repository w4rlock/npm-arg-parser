/**
 * Parse command line arguments
 * @param {object} model model object
 * @returns {object} parsed arguments
 */
function parseCmdArguments(modelOptions) {
  if (!modelOptions || modelOptions.length < 1) {
    throw new Error('modelOptions is required');
  }
  const out = {};
  // example arv = ["node", "path/to/script.js", "--arg", "val", "-x"]
  const { argv } = process;
  // argv[1] = /path/to/script.js
  // scriptName = ./script.js
  // const scriptName = `./${argv[1].substring(argv[1].lastIndexOf("/") + 1)}`;
  // rest of arguments
  const args = argv.slice(2);
  // current iteration arg
  let cmdFlag = '';
  // next iteration arg (this can be a "value" or another --parameter)
  let nextCmdFlag = '';
  // user conf model
  let model;
  // command line parsed arg
  // example: ./ejemplo.js --some xx
  // { name: '--some', value: 'xx', slice: true}
  let arg = {};
  // parsed arguments are stored in "out" object with normalize "outKey"
  // cmdFlag = --version
  // outKey = version
  let outKey;
  // returns object model for argument
  // in: --help
  // out: { name: "--help", value: {...}}
  const findModelForArg = arg =>
    modelOptions.find(opt => opt.name == arg || opt.short == arg);

  // command line all arguments
  for (let i = 0; i < args.length; i++) {
    cmdFlag = args[i];
    nextCmdFlag = args[i + 1];
    // smart raw parameter parsed
    arg = parseCmdArgument(cmdFlag, nextCmdFlag);
    model = findModelForArg(arg.name);
    // --invalid-param
    if (!model) {
      showHelp(modelOptions);
      exit(1, `ERROR: \n Unknown option "${cmdFlag}"`);
    }
    // model.name: --help
    // outKey = 'help'
    outKey = model.name.replace(/[^a-z]/gi, '');
    // model require an value
    if (model.value) {
      if (!arg.value) {
        exit(1, `Error value is required for "${model.name}" parameter.`);
      }
      out[outKey] = parseArgValue(model, arg.value);
      if (arg.slice) {
        i++;
      }
    } else if (arg.value) {
      exit(1, `Error argument "${model.name}" not allow values.`);
    } else {
      out[outKey] = true;
    }
  }
  return out;
}

/**
 * if string is cmd valid argument
 *
 * @param {string} p some string to check
 * @returns {boolean} if is parameter
 */
// for: --help or -h
const isParameter = p => p && p.startsWith('-');

/**
 * Parse user model for input value
 *
 * @param {object} model user model for handle argument value
 * @param {string} value command line value
 * @returns {any } parsed value
 */
const parseArgValue = (model, value) => {
  if (!model.value || !model.value.type) {
    return value;
  }

  let exitForType = type =>
    exit(1, `\n  ERROR:\n\tParameter "${model.name}" requires a valid ${type}`);

  let res;
  if (model.value.type instanceof RegExp) {
    res = value.match(model.value.type);
    if (!res || res.length < 1) {
      let strRegExp = model.value.type.toLocaleString();
      exitForType(`Regular Expression for "${strRegExp}"`);
    }
  } else {
    switch (model.value.type) {
      case 'float':
        res = parseFloat(value);
        if (Number.isNaN(res)) {
          exitForType('float number');
        }
        break;
      case 'int':
        res = parseInt(value);
        if (Number.isNaN(res)) {
          exitForType('int number');
        }
        break;
      default:
        res = value;
    }
  }

  return res;
};

/**
 * Parse cmd parameter
 *
 * @param {string} flag --some
 * @param {string} value somevalue
 * @returns {object} name and value arg
 */
const parseCmdArgument = (flag, value) => {
  const v = flag.split('=');
  const out = {
    name: '',
    value: '',
    slice: false,
  };

  out.name = v[0];
  // --arg-name=value
  if (v.length > 1) {
    out.value = v.slice(1).join('=');
    // yes: --arg value
    // no:  --arg -value
  } else if (!isParameter(value)) {
    out.value = value;
    out.slice = true;
  }
  return out;
};

/**
 * Show help menu with options.
 *
 * @param {array} modelOptions user options config
 */
const showHelp = modelOptions => {
  const { argv } = process;
  const scriptName = `./${argv[1].substring(argv[1].lastIndexOf('/') + 1)}`;
  console.log(`
    USAGE:
      ${scriptName} <OPCION>

    OPCIONES:
  `);

  for (const model of modelOptions) {
    console.log(`\t${model.name}`);
  }
};

/**
 * Exit this script
 *
 * @param {int} code=0 Exit code
 * @param {string} msg='' message to log
 */
function exit(code = 0, msg = '') {
  if (msg) {
    console.log(`\n${msg}\n`);
  }
  process.exit(code);
}

module.exports = parseCmdArguments;