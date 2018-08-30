const { RunnerTemplate } = require('@cajacko/template');

class GitAttributes extends RunnerTemplate {
  setupFiles() {
    return this.runner.copy(
      this.getTmplPath('.gitattributes'),
      '.gitattributes',
    );
  }
}

module.exports = GitAttributes;
