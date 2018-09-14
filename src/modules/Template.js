// @flow

import { join } from 'path';
import { runCommand, getSettings, logger } from '@cajacko/template-utils';

let installID = 0;

class Template {
  constructor(
    templateConfig,
    projectConfig,
    commander,
    env,
    projectDir,
    command,
  ) {
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

    this.installDependencies = this.installDependencies.bind(this);
  }

  installDependencies(dir) {
    if (this.commander.offline) return Promise.resolve();
    installID += 1;

    const finalDir = dir || this.tmpDir;

    logger.log(`${installID} - Installing dependencies - ${finalDir}`);
    return runCommand('yarn install', finalDir, { noLog: true }).then(() => {
      logger.log(`${installID} - Finished installing dependencies - ${finalDir}`);
    });
  }

  runIfUseLocal(cb) {
    // TODO: if command is deploy and on CI, never use local lib
    if (!this.env.USE_LOCAL_LIBS) return Promise.resolve();

    return cb();
  }

  getActiveLibDir() {
    if (!this.env.USE_LOCAL_LIBS) return Promise.resolve(this.libDir);

    return getSettings('localNPMPackagePaths').then(localNPMPackagePaths => localNPMPackagePaths['@cajacko/lib']);
  }
}

export default Template;
