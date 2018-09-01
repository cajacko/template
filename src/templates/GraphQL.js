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

class GraphQL extends Template {
  constructor(...args) {
    super(...args);

    this.tmplDir = join(this.filesDir, 'graphql');
    this.tmplSrcDir = join(this.tmplDir, 'src');
    this.tmplFuncDir = join(this.tmplSrcDir, 'functions');
    this.libOutDir = join(this.tmpDir, 'node_modules/@cajacko/lib');
  }

  start() {
    return ensureDir(this.tmpDir)
      .then(() => copy(this.tmplSrcDir, this.tmpDir))
      .then(this.installDependencies)
      .then(() => runCommand('yarn start', this.tmpDir))
      .catch((e) => {
        console.error(e);
        process.exit(1);
      });
  }
}

export default GraphQL;
