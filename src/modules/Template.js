// @flow

import { join } from 'path';
import {
  runCommand,
  getSettings,
  logger,
  CertStorage,
} from '@cajacko/template-utils';
import type { Commander, Env } from '@cajacko/template-utils/lib/types';
import type { TemplateConfig, Command, ProjectConfig } from '../types';

let installID = 0;

/**
 * The template base class, registers helper methods
 */
class Template {
  /**
   * Initialise the class and set any props to be used by the templates
   *
   * @param {Object} templateConfig The template config
   * @param {Object} projectConfig The project config
   * @param {Object} commander The commander object
   * @param {Object} env The env object
   * @param {String} projectDir The project dir path
   * @param {String} command The command being run
   * @param {CertStorage} certStorage The certStorage instance for the project
   *
   * @return {Void} No return value
   */
  constructor(
    templateConfig: TemplateConfig,
    projectConfig: ProjectConfig,
    commander: Commander,
    env: Env,
    projectDir: string,
    command: Command,
    certStorage: CertStorage
  ) {
    this.certStorage = certStorage;
    this.commander = commander;
    this.templateConfig = templateConfig;
    this.projectConfig = projectConfig;
    this.env = env;
    this.projectDir = projectDir;
    this.command = command;
    this.filesDir = join(__dirname, '../../files');
    this.tmpDir = join(projectDir, 'tmp', templateConfig.key);
    this.projectSrcDir = join(projectDir, 'src');
    this.libDir = join(projectDir, 'node_modules/@cajacko/lib');
    this.shouldWatch = this.command === 'start';

    (this: any).installDependencies = this.installDependencies.bind(this);
  }

  certStorage: CertStorage;
  env: Env;
  projectConfig: ProjectConfig;
  filesDir: string;
  command: Command;
  commander: Commander;
  projectDir: string;
  tmpDir: string;
  templateConfig: TemplateConfig;
  projectSrcDir: string;
  libDir: string;
  shouldWatch: boolean;

  /**
   * Install the dependencies for the template
   *
   * @param {String} [dir] The directory to run the command in
   * @param {Object} [opts] Any additional options to pass to runCommand
   *
   * @return {Promise} Promise that resolves when the install has finished
   */
  installDependencies(dir?: ?string, opts?: {} = {}) {
    if (this.commander.offline) return Promise.resolve();
    installID += 1;

    const finalDir = dir || this.tmpDir;

    logger.log(`${installID} - Installing dependencies - ${finalDir}`);
    return runCommand('yarn install', finalDir, { noLog: true, ...opts }).then(() => {
      logger.log(`${installID} - Finished installing dependencies - ${finalDir}`);
    });
  }

  /**
   * Run the callback if we're using the local libs
   *
   * @param {Function} cb The callback to run
   *
   * @return {Promise} Promise that resolves when the cb has run or straight
   * away if we don't run it
   */
  runIfUseLocal(cb: () => Promise<any>) {
    // TODO: if command is deploy and on CI, never use local lib
    if (!this.env.USE_LOCAL_LIBS) return Promise.resolve();

    return cb();
  }

  /**
   * Get the directory for the lib module that we should use.
   *
   * @return {Promise} Promise that resolves with the lib dir to use
   */
  getActiveLibDir() {
    if (!this.env.USE_LOCAL_LIBS) return Promise.resolve(this.libDir);

    return getSettings('localNPMPackagePaths').then(localNPMPackagePaths => localNPMPackagePaths['@cajacko/lib']);
  }
}

export default Template;
