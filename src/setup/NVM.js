import SetupTemplate from '../modules/SetupTemplate';
import { runCommand } from '@cajacko/template-utils';
import { exec } from 'child_process';

class NVM extends SetupTemplate {
  constructor(...args) {
    super(...args);

    if (this.projectConfig && this.projectConfig.templates) {
      this.hasServerFuncs = Object.values(this.projectConfig.templates).some(({ type }) => type === 'graphql');
    }
  }

  setupFiles() {
    if (!this.hasServerFuncs) return Promise.resolve();

    this.runner.packagejson.packageJSON.engines = {
      node: '>=6.14.0 <7.0.0',
    };

    return this.fs.writeFile('.nvmrc', 'v6.14.0');
  }

  preInstallDependencies() {
    if (!this.hasServerFuncs) return Promise.resolve();

    // exec('nvm use v6.14.0', { cwd: this.projectDir });

    // return runCommand('echo $PATH', this.projectDir).then(() => {
    //   throw new Error('Oh pooop');
    // });

    // throw new Error('Oh pooop');
  }
}

export default NVM;
