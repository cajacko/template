const { join } = require('path');
const { readJSON, pathExists } = require('fs-extra');
const merge = require('lodash/merge');
const inquirer = require('inquirer');
const globals = require('./globals');
const runCommand = require('./runCommand');
const git = require('./git');
const fs = require('./fs');

let destPath = process.cwd();

class Utils {
  constructor() {
    this.runCommand = runCommand;
    this.git = git;
    this.fs = fs;
    this.prompt = inquirer.prompt;
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

  getSrcDir() {
    return this.getSrcRelativePath().then(src => this.getDestPath(src));
  }

  getProjectEnv() {
    const envPath = this.getDestPath('.env');
    const localEnvPath = this.getDestPath('.env.local');

    const parseEnv = (file) => {
      const env = {};

      if (!file) return env;

      const lines = file.split('\n');

      lines.forEach((line) => {
        const variable = line.split('=');

        if (variable.length === 2) {
          const [key, value] = variable;
          env[key] = value;
        }
      });

      return env;
    };

    return Promise.all([
      this.getFileIfExists(envPath),
      this.getFileIfExists(localEnvPath),
    ]).then(([envContents, envLocalContents]) => {
      const env = parseEnv(envContents);
      const envLocal = parseEnv(envLocalContents);

      return merge(env, envLocal);
    });
  }

  getFileIfExists(path) {
    return pathExists(path).then();
  }

  getSrcRelativePath() {
    return this.getProjectConfig().then((config) => {
      let src;

      if (config && config.src) {
        ({ src } = config);
      } else {
        src = 'src';
      }

      return src;
    });
  }
}

module.exports = Utils;
