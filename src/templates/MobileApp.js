// @flow

import { join } from 'path';
import { ensureDir, copy, readJSON, writeJSON } from 'fs-extra';
import {
  runCommand,
  copyTmpl,
  copyDependencies,
  copyAndWatch,
} from '@cajacko/template-utils';
import Template from '../modules/Template';
import { registerLibOutDir, setOutDirIsReady } from '../utils/libOutDirs';

class MobileApp extends Template {
  constructor(...args) {
    super(...args);

    this.tmplDir = join(this.filesDir, 'mobile');
    this.tmplSrcDir = join(this.tmplDir, 'src');
    this.libOutDir = join(this.tmpDir, 'node_modules/@cajacko/lib');

    this.runIfUseLocal(() => registerLibOutDir(this.libOutDir));
  }

  setSplashIcon() {
    const splashIconPath = this.templateConfig.splashIcon;

    if (!splashIconPath) return Promise.resolve();

    const appJSONPath = join(this.tmpDir, 'app.json');

    return readJSON(appJSONPath).then((contents) => {
      const appJSON = Object.assign({}, contents);

      appJSON.expo.splash.image = `./${splashIconPath}`;

      return writeJSON(appJSONPath, appJSON, { spaces: 2 });
    });
  }

  start() {
    Promise.all([
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
      })
        .then(() =>
          Promise.all([
            this.installDependencies().then(() =>
              this.runIfUseLocal(() => setOutDirIsReady(this.libOutDir))),
            copyAndWatch(this.projectSrcDir, join(this.tmpDir, 'src')),
            copyTmpl(
              join(this.tmplDir, 'config.js'),
              join(this.tmpDir, 'config.js'),
              this.templateConfig,
            ),
            this.setSplashIcon(),
          ]))
        .then(() => runCommand('yarn start', this.tmpDir))
        .catch((e) => {
          console.error(e);
          process.exit(1);
        }));
  }
}

export default MobileApp;
