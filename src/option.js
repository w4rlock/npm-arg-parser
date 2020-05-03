/**
 *
 * Builder option class  for easy arguments
 * configuration.
 *
 */
class Option {
  constructor(name) {
    this.name = name;
    this.required = false;
  }

  desc(description) {
    this.description = description;
    return this;
  }

  int() {
    this.type = 'int';
    return this;
  }

  float() {
    this.type = 'float';
    return this;
  }

  string() {
    this.type = 'string';
    return this;
  }

  regexp(regexp) {
    this.type = regexp;
    return this;
  }

  short(alias) {
    this.alias = alias;
    return this;
  }

  isRequired() {
    this.required = true;
    return this;
  }
}


module.exports = Option
