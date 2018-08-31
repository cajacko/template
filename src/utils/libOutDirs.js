// @flow

import { getSettings, runCommand } from '@cajacko/template-utils';

let resolvePromise;

const libOutDirs = {};

const watchLib = () =>
  getSettings('localNPMPackagePaths')
    .then((localNPMPackagePaths) => {
      const libPath = localNPMPackagePaths['@cajacko/lib'];

      const outDirOptions = Object.keys(libOutDirs).reduce(
        (acc, val) => `${acc} --${val}`,
        '',
      );

      return runCommand(`yarn build:lib ${outDirOptions}`, libPath).then(() => {
        runCommand(`yarn watch:lib ${outDirOptions}`, libPath);
      });
    })
    .then(resolvePromise);

export const isWatching = new Promise((resolve) => {
  resolvePromise = resolve;
});

export const registerLibOutDir = (dir) => {
  libOutDirs[dir] = false;
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
