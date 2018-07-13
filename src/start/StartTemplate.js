const { ensureDir, copy } = require('fs-extra');
const { join } = require('path');
const Utils = require('../utils/Utils');

class StartTemplate extends Utils {
  constructor(key, config) {
    super();

    this.config = config;
    this.key = key;
    this.tmpDir = join(__dirname, '../../tmp', this.key);
    this.srcDestination = null;
    this.templateSrc = null;

    this.copySrcFiles = this.copySrcFiles.bind(this);
    this.copyTemplateFiles = this.copyTemplateFiles.bind(this);
  }

  setSrcDestination(path) {
    this.srcDestination = path;
  }

  setTemplateSrc(path) {
    this.templateSrc = path;
  }

  setup() {
    return ensureDir(this.tmpDir);
  }

  copyTemplateFiles() {
    if (!this.templateSrc) {
      throw new Error('No template src is set, make sure the template your running has set this.setTemplateSrc(path)');
    }

    return copy(this.templateSrc, this.tmpDir);
  }

  copySrcDependencies() {
    return Promise.resolve();
  }

  copySrcFiles() {
    return this.getSrcDir().then((srcDir) => {
      if (!this.srcDestination) {
        throw new Error('No src destination set in the template, run this.setSrcDestination(path) when setting up the template');
      }

      return this.getSrcRelativePath().then(relativeSrc =>
        copy(srcDir, join(this.tmpDir, this.srcDestination, relativeSrc)));
    });
  }

  _watchSrcFiles() {
    return Promise.resolve();
  }

  watchTemplateFiles() {}
}

module.exports = StartTemplate;
