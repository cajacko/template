// @flow

import { join } from 'path';
import { runCommand, getSettings } from '@cajacko/template-utils';

class Template {
  constructor(templateConfig, projectConfig, commander, env, projectDir) {
    this.commander = commander;
    this.templateConfig = templateConfig;
    this.projectConfig = projectConfig;
    this.env = env;
    this.projectDir = projectDir;
    this.filesDir = join(__dirname, '../../files');
    this.tmpDir = join(projectDir, 'tmp', templateConfig.key);
    this.projectSrcDir = join(projectDir, 'src');
    this.libDir = join(projectDir, 'node_modules/@cajacko/lib');

    this.installDependencies = this.installDependencies.bind(this);
  }

  installDependencies(dir) {
    if (this.commander.offline) return Promise.resolve();
    return runCommand('yarn install', dir || this.tmpDir);
  }

  runIfUseLocal(cb) {
    if (!this.env.USE_LOCAL_LIBS) return Promise.resolve();

    return cb();
  }

  getActiveLibDir() {
    if (!this.env.USE_LOCAL_LIBS) return Promise.resolve(this.libDir);

    return getSettings('localNPMPackagePaths').then(localNPMPackagePaths => localNPMPackagePaths['@cajacko/lib']);
  }
}

export default Template;
