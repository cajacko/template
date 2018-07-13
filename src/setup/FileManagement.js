const {
  copy, ensureFile, pathExists, writeJSON,
} = require('fs-extra');
const Dependencies = require('./Dependencies');
const { copyTmpl } = require('../utils/fs');

class FileManagement extends Dependencies {
  constructor() {
    super();

    this.filesToWrite = {};
  }

  writeFiles() {
    const promises = [];

    Object.keys(this.filesToWrite).forEach((dest) => {
      const {
        onlyIfDoesNotExist, path, variables, json,
      } = this.filesToWrite[
        dest
      ];

      const promise = () =>
        this.conditionallyCheckIfExists(dest, onlyIfDoesNotExist, () =>
          ensureFile(dest).then(() => {
            if (json) {
              return writeJSON(dest, json, { spaces: 2 });
            }

            if (variables) {
              return copyTmpl(path, dest, variables);
            }

            return copy(path, dest);
          }));

      promises.push(promise);
    });

    return this.promiseQueue(promises, 10);
  }

  conditionallyCheckIfExists(dest, onlyIfDoesNotExist, cb) {
    if (onlyIfDoesNotExist) {
      return pathExists(dest).then((exists) => {
        if (exists) return Promise.resolve();

        return cb();
      });
    }

    return cb();
  }

  copyIfDoesNotExist(src, relativeDest) {
    const dest = this.getDestPath(relativeDest);

    this.filesToWrite[dest] = {
      onlyIfDoesNotExist: true,
      path: src,
    };
  }

  copyTmpl(src, relativeDest, options) {
    const dest = this.getDestPath(relativeDest);

    this.filesToWrite[dest] = {
      path: src,
      variables: options,
    };
  }

  writeJSON(json, relativeDest) {
    const dest = this.getDestPath(relativeDest);

    this.filesToWrite[dest] = {
      json,
    };
  }

  copy(src, relativeDest) {
    const dest = this.getDestPath(relativeDest);

    this.filesToWrite[dest] = {
      path: src,
    };
  }
}

module.exports = FileManagement;
