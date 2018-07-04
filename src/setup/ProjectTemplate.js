const RunnerTemplate = require('./RunnerTemplate');

class ProjectTemplate extends RunnerTemplate {
  constructor(runner, templateConfig) {
    super(runner);

    this.templateConfig = templateConfig;
  }
}

module.exports = ProjectTemplate;
