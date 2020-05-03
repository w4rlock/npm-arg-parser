/**
 *
 * Util static class
 *
 */
class Util {
  static getScriptArguments() {
    return process.argv.slice(2);
  }

  static getScriptName() {
    const [, jsName] = process.argv;
    return jsName.substr(jsName.lastIndexOf('/') + 1);
  }

  static isParameter(paramOrValue) {
    return paramOrValue && paramOrValue.startsWith('-');
  }

  static normalizedParamName(param) {
    return param.replace(/[^a-z]/gi, '');
  }

  static exit(code, msg = '') {
    // eslint-disable-next-line no-console
    if (msg) console.log(`\n  ${msg}\n`);
    process.exit(code);
  }

  static maxStringLength(arrString = []) {
    return arrString.reduce((acc = '', str = '') => {
      return str.length > acc.length ? str: acc;
    }).length || 0
  }
}

module.exports = Util;
