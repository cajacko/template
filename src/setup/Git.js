const { RunnerTemplate } = require('@cajacko/template');

class Git extends RunnerTemplate {
  setupFiles() {
    this.runner.addNodeModules({
      husky: { type: 'dev', version: '0.14.3' },
    });
  }
}

module.exports = Git;
