const { ensureDir } = require('fs-extra');
const { join } = require('path');
const Utils = require('../utils/Utils');

class StartTemplate extends Utils {
  constructor(key, config) {
    super();

    this.config = config;
    this.key = key;
    this.tmpDir = join(__dirname, '../../tmp', this.key);
  }

  setup() {
    return ensureDir(this.tmpDir);
  }

  copyTemplateFiles() {
    return this.getSrcDir().then((srcDir) => {
      console.log(srcDir);
    });
  }

  copySrcDependencies() {
    return Promise.resolve();
  }

  installDependencies() {
    return Promise.resolve();
  }

  copySrcFiles() {
    return Promise.resolve();
  }

  run() {
    return Promise.resolve();
  }

  watchSrcFiles() {
    return Promise.resolve();
  }
}

module.exports = StartTemplate;
