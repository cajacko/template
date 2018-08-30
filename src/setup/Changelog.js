const { RunnerTemplate } = require('@cajacko/template');

class Changelog extends RunnerTemplate {
  setupFiles() {
    return this.runner.copyIfDoesNotExist(
      this.getTmplPath('CHANGELOG.md'),
      'CHANGELOG.md',
    );
  }
}

module.exports = Changelog;
