// @flow

import { getSettings, runCommand } from '@cajacko/template-utils';

let resolvePromise;

const libOutDirs = {};
const libDirsToWatch = {};

const watchLib = () =>
  getSettings('localNPMPackagePaths')
    .then((localNPMPackagePaths) => {
      const libPath = localNPMPackagePaths['@cajacko/lib'];

      const getDirOptions = obj =>
        Object.keys(obj).reduce((acc, val) => `${acc} --${val}`, '');

      const outDirOptions = getDirOptions(libOutDirs);
      const watchDirs = getDirOptions(libDirsToWatch);

      return runCommand(`yarn build:lib ${outDirOptions}`, libPath).then(() => {
        if (watchDirs !== '') {
          runCommand(`yarn watch:lib ${watchDirs}`, libPath);
        }
      });
    })
    .then(resolvePromise);

export const isWatching = new Promise((resolve) => {
  resolvePromise = resolve;
});

export const registerLibOutDir = (dir, shouldWatch) => {
  libOutDirs[dir] = false;

  if (shouldWatch) {
    libDirsToWatch[dir] = true;
  }
};

export const setOutDirIsReady = (dir) => {
  libOutDirs[dir] = true;

  const canWatch = Object.values(libOutDirs).find(val => !!val);

  if (canWatch) {
    watchLib();
  }

  return isWatching;
};

export const get = () => libOutDirs;
