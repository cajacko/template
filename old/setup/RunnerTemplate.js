const Utils = require('../utils/Utils');

class RunnerTemplate extends Utils {
  constructor(runner, options) {
    super(runner.destPath);

    this.fs = runner.fs;
    this.npm = runner.npm;

    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        this[key] = options[key];
      });
    }

    this.runner = runner;

    if (this.init) this.init();
  }
}

module.exports = RunnerTemplate;
