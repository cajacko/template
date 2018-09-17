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
    let command = `yarn run babel ${this.projectSrcDir} --out-dir ${this.babelOutDir} -s --copy-files --presets=env,flow --plugins=transform-object-rest-spread`;

    if (this.templateConfig.babelIgnore) {
      command = `${command} --ignore `;

      this.templateConfig.babelIgnore.forEach((ignore, i) => {
        if (i !== 0) {
          command = `${command},`;
        }

        command = `${command}${ignore}`;
      });
    }

    return ensureDir(this.tmpDir)
      .then(() => copy(this.tmplDir, this.tmpDir))
      .then(this.installDependencies)
      .then(() => copy(this.projectSrcDir, this.babelOutDir))
      .then(() =>
        runCommand(
          command,
          this.tmpDir
        ));
  }
}

export default NPMModule;
