const { RunnerTemplate } = require('@cajacko/template');

class Env extends RunnerTemplate {
  setupFiles() {
    this.runner.copyIfDoesNotExist(this.getTmplPath('.env'), '.env');
    this.runner.copyIfDoesNotExist(this.getTmplPath('.env'), '.env.local');
  }
}

module.exports = Env;
