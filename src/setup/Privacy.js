import SetupTemplate from '../modules/SetupTemplate';

class Privacy extends SetupTemplate {
  setupFiles() {
    return this.fs.copyTmpl('PRIVACY.md', null, this.projectConfig);
  }
}

export default Privacy;
