// @flow

import { remove } from 'fs-extra';
import { join } from 'path';
import { getSettings, runCommand, logger } from '@cajacko/template-utils';

let resolvePromise;

const libOutDirs = {};
const libDirsToWatch = {};
let watchLibHasRun = false;

/**
 * Watch the lib dir, copying the files to everywhere that's subscribed
 *
 * @return {Promise} Resolves after the first build
 */
const watchLib = () => {
  if (watchLibHasRun) {
    throw new Error('Trying to run the libOutDir command multiple times. This should never happen');
  }

  watchLibHasRun = true;

  return getSettings('localNPMPackagePaths')
    .then((localNPMPackagePaths) => {
      const libPath = localNPMPackagePaths['@cajacko/lib'];

      /**
       * Get the options string to pass to the gulp task, from the object of
       * dirs to build to
       *
       * @param {Object} obj Object of each dir to copy to
       *
       * @return {String} The options to pass to the build/watch tasks
       */
      const getDirOptions = obj =>
        Object.keys(obj).reduce((acc, val) => `${acc} --${val}`, '');

      const outDirOptions = getDirOptions(libOutDirs);
      const watchDirs = getDirOptions(libDirsToWatch);

      /**
       * Build and then watch the lib
       *
       * @return {Promise} Resolves when the first build has finished
       */
      const buildAndWatchLib = () =>
        runCommand(`yarn build:lib ${outDirOptions}`, libPath).then(() => {
          if (watchDirs !== '') {
            runCommand(`yarn watch:lib ${watchDirs}`, libPath);
          }
        });

      /**
       * Remove then reinstall the node modules
       *
       * @return {Promise} Resolves when the install finishes
       */
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

export const isWatching: Promise<void> = new Promise((resolve) => {
  resolvePromise = resolve;
});

/**
 * Register a directory to build and/or watch to, when the lib module changes
 *
 * @param {String} dir The out dir to register
 * @param {Boolean} [shouldWatch] Whether we should watch as well as build
 *
 * @return {Void} No return value
 */
export const registerLibOutDir = (dir: string, shouldWatch?: boolean) => {
  libOutDirs[dir] = false;

  if (shouldWatch) {
    libDirsToWatch[dir] = true;
  }
};

/**
 * Indicate that one of the out dirs, is now ready to be processed. If all are
 * now ready, we will process the lib
 *
 * @param {String} dir The directory to indicate is ready
 *
 * @return {Void} No return value
 */
export const setOutDirIsReady = (dir: string) => {
  libOutDirs[dir] = true;

  const canWatch = !Object.values(libOutDirs).some(val => !val);

  if (canWatch) {
    watchLib();
  }

  return isWatching;
};

/**
 * Get an object of all the out dirs, we're building to
 *
 * @return {Object} Object keyed by the out dirs
 */
export const get = () => libOutDirs;
