// @flow

import { join } from 'path';
import { ensureDir, copy } from 'fs-extra';
import {
  getSettings,
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

    registerLibOutDir(this.libOutDir);
  }

  start() {
    Promise.all([
      getSettings('localNPMPackagePaths'),
      ensureDir(this.tmpDir)
        .then(() => copy(this.tmplSrcDir, this.tmpDir))
        .then(() =>
          copyDependencies(this.projectDir, this.tmpDir, {
            ignore: ['@cajacko/template'],
          })),
    ]).then(([localNPMPackagePaths]) => {
      const localLibPath = localNPMPackagePaths['@cajacko/lib'];

      copyDependencies(localLibPath, this.tmpDir, {
        ignore: ['@cajacko/template'],
      })
        .then(() =>
          Promise.all([
            this.installDependencies().then(() =>
              setOutDirIsReady(this.libOutDir)),
            copyAndWatch(this.projectSrcDir, join(this.tmpDir, 'src')),
            copyTmpl(
              join(this.tmplDir, 'config.js'),
              join(this.tmpDir, 'config.js'),
              this.templateConfig,
            ),
          ]))
        .then(() => runCommand('yarn start', this.tmpDir));
    });
  }
}

export default MobileApp;
