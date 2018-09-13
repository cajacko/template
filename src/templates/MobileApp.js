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
    this.shouldWatch = this.command === 'start';

    if (this.shouldWatch) {
      this.runIfUseLocal(() => registerLibOutDir(this.libOutDir));
    }
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
      return copyAndWatch(this.projectSrcDir, tmpSrc);
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
          this.installDependencies().then(() => {
            if (this.shouldWatch) {
              return this.runIfUseLocal(() => setOutDirIsReady(this.libOutDir));
            }

            return Promise.resolve();
          }),
          this.copyOrWatchSrc(),
          copyTmpl(
            join(this.tmplDir, 'config.js'),
            join(this.tmpDir, 'config.js'),
            this.templateConfig,
          ),
          this.setAppJSON(),
        ])));
  }

  prepareAndRun(command) {
    return this.prepare().then(() => runCommand(`yarn run ${command}`, this.tmpDir));
  }

  deploy() {
    return this.prepareAndRun('deploy');
  }

  start() {
    return this.prepareAndRun('start');
  }
}

export default MobileApp;
