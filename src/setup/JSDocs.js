const { RunnerTemplate } = require('@cajacko/template');

class JSDocs extends RunnerTemplate {
  setupFiles() {
    const promises = [];

    promises.push(this.runner.copy(this.getTmplPath('jsdoc.json'), 'jsdoc.json'));

    promises.push(this.runner.addNodeModules({
      jsdoc: { type: 'dev', version: '3.5.5' },
    }));

    return Promise.all(promises);
  }
}

module.exports = JSDocs;
