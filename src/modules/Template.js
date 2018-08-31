// @flow

import { join } from 'path';
import { runCommand } from '@cajacko/template-utils';

class Template {
  constructor(templateConfig, projectConfig, env, projectDir) {
    this.templateConfig = templateConfig;
    this.projectConfig = projectConfig;
    this.env = env;
    this.projectDir = projectDir;
    this.filesDir = join(__dirname, '../../files');
    this.tmpDir = join(projectDir, 'tmp', templateConfig.key);
    this.projectSrcDir = join(projectDir, 'src');
    this.libDir = join(projectDir, 'node_modules/@cajacko/lib');
  }

  installDependencies(dir) {
    return runCommand('yarn install', dir || this.tmpDir);
  }
}

export default Template;
