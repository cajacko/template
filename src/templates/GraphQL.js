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

/**
 * Run the graphQL template
 */
class GraphQL extends Template {
  /**
   * Initialise the class and define any helper props
   *
   * @param  {...any} args The args to pass up to the parent class
   *
   * @return {Void} No return value
   */
  constructor(...args) {
    super(...args);

    this.tmplDir = join(this.filesDir, 'graphql');
    this.tmplSrcDir = join(this.tmplDir, 'src');
    this.tmpFuncDir = join(this.tmpDir, 'functions');
    this.libOutDir = join(this.tmpFuncDir, 'node_modules/@cajacko/lib');
    this.nvmVersion = 'v6.14.0';
  }

  /**
   * When the class initialises decide whether to register the lib out dir
   *
   * @return {Promise} Promise that resolves when we've figured it out
   */
  init() {
    this.runIfUseLocal(() =>
      registerLibOutDir(this.libOutDir, this.shouldWatch));
  }

  /**
   * Start the graphQL template
   *
   * @return {Promise} Promise that resolves when the template has been built
   */
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
          this.installDependencies(null, { withNVM: this.nvmVersion }).then(() => this.runIfUseLocal(() => setOutDirIsReady(this.libOutDir))),
          copyAndWatch(this.projectSrcDir, join(this.tmpFuncDir, 'src'), {
            transpile: true,
          }),
          copyTmpl(
            join(this.tmplDir, 'config.js'),
            join(this.tmpFuncDir, 'config.js'),
            this.templateConfig
          ),
        ]))
      .then(() =>
        runCommand('yarn start', this.tmpDir, {
          withNVM: this.nvmVersion,
        }));
  }

  /**
   * When finished unregister the lib out dir
   *
   * @return {Void} No return value
   */
  onFinish() {
    this.runIfUseLocal(() => unregisterLibOutDir(this.libOutDir));
  }
}

export default GraphQL;
