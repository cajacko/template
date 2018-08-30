const { RunnerTemplate } = require('@cajacko/template');

class Project extends RunnerTemplate {
  init() {
    this.runner.add('preRun', [() => this.getExistingConfig()]);
  }

  getExistingConfig() {
    return this.getProjectConfig().then((projectConfig) => {
      if (projectConfig) {
        this.runner.set('projectConfig', projectConfig);
      }
    });
  }
}

module.exports = Project;
