const Utils = require('../utils/Utils');

class RunnerTemplate extends Utils {
  constructor(runner) {
    super(runner.destPath);

    this.runner = runner;

    if (this.init) this.init();
  }
}

module.exports = RunnerTemplate;
