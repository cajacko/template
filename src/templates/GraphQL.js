// @flow

import { join } from 'path';
import { ensureDir, copy } from 'fs-extra';
import {
  runCommand,
  copyTmpl,
  copyDependencies,
} from '@cajacko/template-utils';
import Template from '../modules/Template';
import {
  registerLibOutDir,
  setOutDirIsReady,
  unregisterLibOutDir,
} from '../utils/libOutDirs';
import copyAndWatch from '../utils/copyAndWatch';

class GraphQL extends Template {
  constructor(...args) {
    super(...args);

    this.tmplDir = join(this.filesDir, 'graphql');
    this.tmplSrcDir = join(this.tmplDir, 'src');
    this.tmpFuncDir = join(this.tmpDir, 'functions');
    this.libOutDir = join(this.tmpFuncDir, 'node_modules/@cajacko/lib');
  }

  init() {
    this.runIfUseLocal(() =>
      registerLibOutDir(this.libOutDir, this.shouldWatch));
  }

  start() {
    return Promise.all([
      this.getActiveLibDir(),
      ensureDir(this.tmpDir).then(() => copy(this.tmplSrcDir, this.tmpDir)),
    ])
      .then(([localLibPath]) =>
        copyDependencies(localLibPath, this.tmpFuncDir, {
          ignore: ['@cajacko/template'],
        }))
      .then(() =>
        Promise.all([
          this.installDependencies().then(() =>
            this.runIfUseLocal(() => setOutDirIsReady(this.libOutDir))),
          copyAndWatch(this.projectSrcDir, join(this.tmpFuncDir, 'src'), {
            transpile: true,
          }),
          copyTmpl(
            join(this.tmplDir, 'config.js'),
            join(this.tmpFuncDir, 'config.js'),
            this.templateConfig,
          ),
        ]))
      .then(() => runCommand('yarn start', this.tmpDir));
  }

  onFinish() {
    this.runIfUseLocal(() => unregisterLibOutDir(this.libOutDir));
  }
}

export default GraphQL;
