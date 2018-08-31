// @flow

let resolvePromise;

const libOutDirs = {};

const watchLib = () => {
  resolvePromise();
};

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
