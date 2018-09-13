// @flow

import { join } from 'path';
import { ensureDir, copy, readJSON, writeJSON } from 'fs-extra';
import {
  runCommand,
  copyTmpl,
  copyDependencies,
} from '@cajacko/template-utils';
import Template from '../modules/Template';
import { registerLibOutDir, setOutDirIsReady } from '../utils/libOutDirs';
import copyAndWatch from '../utils/copyAndWatch';

class MobileApp extends Template {
  constructor(...args) {
    super(...args);

    this.tmplDir = join(this.filesDir, 'mobile');
    this.tmplSrcDir = join(this.tmplDir, 'src');
    this.libOutDir = join(this.tmpDir, 'node_modules/@cajacko/lib');
  }

  init() {
    this.runIfUseLocal(() =>
      registerLibOutDir(this.libOutDir, this.shouldWatch));
  }

  setAppJSON() {
    const splashIconPath = this.templateConfig.splashIcon;
    const expoName = this.templateConfig.name || this.projectConfig.title;
    const expoSlug = this.templateConfig.slug || this.projectConfig.slug;

    if (!splashIconPath) return Promise.resolve();

    const appJSONPath = join(this.tmpDir, 'app.json');

    return readJSON(appJSONPath).then((contents) => {
      const appJSON = Object.assign({}, contents);

      appJSON.expo.splash.image = `./${splashIconPath}`;
      appJSON.expo.name = expoName;
      appJSON.expo.slug = expoSlug;

      return writeJSON(appJSONPath, appJSON, { spaces: 2 });
    });
  }

  copyOrWatchSrc() {
    const tmpSrc = join(this.tmpDir, 'src');

    if (this.shouldWatch) {
      return copyAndWatch(this.projectSrcDir, tmpSrc, { exitOnError: true });
    }

    return copy(this.projectSrcDir, tmpSrc);
  }

  prepare() {
    return Promise.all([
      this.getActiveLibDir(),
      ensureDir(this.tmpDir)
        .then(() => copy(this.tmplSrcDir, this.tmpDir))
        .then(() =>
          copyDependencies(this.projectDir, this.tmpDir, {
            ignore: ['@cajacko/template'],
          })),
    ]).then(([localLibPath]) =>
      copyDependencies(localLibPath, this.tmpDir, {
        ignore: ['@cajacko/template'],
      }).then(() =>
        Promise.all([
          this.installDependencies().then(() =>
            this.runIfUseLocal(() => setOutDirIsReady(this.libOutDir))),
          this.copyOrWatchSrc(),
          copyTmpl(
            join(this.tmplDir, 'config.js'),
            join(this.tmpDir, 'config.js'),
            this.templateConfig,
          ),
          this.setAppJSON(),
        ])));
  }

  prepareAndRun(...commands) {
    const runCommands = (i = 0) => {
      const command = commands[i];

      if (!command) return Promise.resolve();

      return runCommand(command, this.tmpDir).then(() => runCommands(i + 1));
    };

    return this.prepare().then(runCommands);
  }

  deploy() {
    return this.prepareAndRun(
      'npx login -u <EXPO USERNAME> -p <EXO PASSWORD>',
      'npx publish --non-interactive',
    );
  }

  start() {
    return this.prepareAndRun('yarn run start');
  }
}

export default MobileApp;
