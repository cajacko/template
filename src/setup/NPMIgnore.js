import SetupTemplate from '../modules/SetupTemplate';

class NPMIgnore extends SetupTemplate {
  setupFiles() {
    if (this.templatesUsed.includes('npm-module')) {
      return this.fs.copy('.npmignore');
    }

    return Promise.resolve();
  }
}

export default NPMIgnore;
