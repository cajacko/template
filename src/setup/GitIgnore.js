const { RunnerTemplate } = require('@cajacko/template');

class GitIgnore extends RunnerTemplate {
  setupFiles() {
    return this.runner.copy(this.getTmplPath('.gitignore'), '.gitignore');
  }
}

module.exports = GitIgnore;
