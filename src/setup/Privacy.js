const { RunnerTemplate } = require('@cajacko/template');

class Privacy extends RunnerTemplate {
  setupFiles() {
    return this.runner.copyTmpl(
      this.getTmplPath('PRIVACY.md'),
      'PRIVACY.md',
      this.runner.projectConfig,
    );
  }
}

module.exports = Privacy;
