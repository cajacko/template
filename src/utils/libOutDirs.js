// @flow

import { remove } from 'fs-extra';
import { join } from 'path';
import { getSettings, runCommand, logger } from '@cajacko/template-utils';

let resolvePromise;

const libOutDirs = {};
const libDirsToWatch = {};
let watchLibHasRun = false;

const watchLib = () => {
  if (watchLibHasRun) {
    throw new Error('Trying to run the libOutDir command multiple times. This should never happen');
  }

  watchLibHasRun = true;

  return getSettings('localNPMPackagePaths')
    .then((localNPMPackagePaths) => {
      const libPath = localNPMPackagePaths['@cajacko/lib'];

      const getDirOptions = obj =>
        Object.keys(obj).reduce((acc, val) => `${acc} --${val}`, '');

      const outDirOptions = getDirOptions(libOutDirs);
      const watchDirs = getDirOptions(libDirsToWatch);

      const buildAndWatchLib = () =>
        runCommand(`yarn build:lib ${outDirOptions}`, libPath).then(() => {
          if (watchDirs !== '') {
            runCommand(`yarn watch:lib ${watchDirs}`, libPath);
          }
        });

      const reinstallLibNodeModules = () =>
        remove(join(libPath, 'node_modules')).then(() =>
          runCommand('yarn install', libPath, { noLog: true }));

      return buildAndWatchLib()
        .catch(() => reinstallLibNodeModules().then(buildAndWatchLib))
        .catch((e) => {
          logger.error(`Failed to compile the lib module at "${libPath}". Sometimes if you remove node_modules and run yarn again inside this dir. It will work.`);
          throw e;
        });
    })
    .then(resolvePromise);
};

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

  const canWatch = !Object.values(libOutDirs).some(val => !val);

  if (canWatch) {
    watchLib();
  }

  return isWatching;
};

export const get = () => libOutDirs;
