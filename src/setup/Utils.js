const { join } = require('path');
const { readJSON } = require('fs-extra');
const globals = require('../utils/globals');
const runCommand = require('../utils/runCommand');
const git = require('../utils/git');

let destPath = process.cwd();

class Utils {
  constructor() {
    this.runCommand = runCommand;
    this.git = git;
  }

  promiseQueue(promises, throttle = 1) {
    let i = 0;

    const runAllPromises = () => {
      if (!promises[i]) return Promise.resolve();

      return Promise.resolve(promises[i]()).then(() => {
        i += 1;
        return runAllPromises();
      });
    };

    return runAllPromises();
  }

  setTmplPath(path) {
    globals.set('tmplPath', path);
  }

  getTmplPath(path) {
    const tmplPath = globals.get('tmplPath');
    if (path) return join(tmplPath, path);

    return tmplPath;
  }

  setDestPath(path) {
    destPath = path;
  }

  getDestPath(path) {
    if (path) return join(destPath, path);

    return destPath;
  }

  getProjectConfigPath() {
    return this.getDestPath('project.json');
  }

  getProjectConfig() {
    return readJSON(this.getProjectConfigPath()).catch(() => null);
  }
}

module.exports = Utils;
