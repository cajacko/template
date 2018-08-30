// @flow

import { join } from 'path';

class SetupTemplate {
  constructor(runner, options) {
    this.fs = runner.fs;
    this.npm = runner.npm;

    if (typeof options === 'object') {
      Object.keys(options).forEach((key) => {
        this[key] = options[key];
      });
    }

    this.runner = runner;

    if (this.init) this.init();
  }

  getTmplPath(path) {
    return join(__dirname, '../files', path);
  }
}

export default SetupTemplate;
