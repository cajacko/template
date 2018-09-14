// @flow

import { join } from 'path';
import { ensureDir, copy } from 'fs-extra';
import { runCommand } from '@cajacko/template-utils';
import Template from '../modules/Template';

class NPMModule extends Template {
  constructor(...args) {
    super(...args);

    this.tmplDir = join(this.filesDir, 'npm-module');
    this.babelOutDir = join(this.projectDir, 'dist');
  }

  prepare() {
    this.build();
  }

  build() {
    return ensureDir(this.tmpDir)
      .then(() => copy(this.tmplDir, this.tmpDir))
      .then(this.installDependencies)
      .then(() =>
        runCommand(
          `yarn run babel ${this.projectSrcDir} --out-dir ${
            this.babelOutDir
          } -s --copy-files`,
          this.tmpDir,
        ));
  }
}

export default NPMModule;
