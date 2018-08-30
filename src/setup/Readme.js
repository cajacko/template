import SetupTemplate from '../modules/SetupTemplate';

class Readme extends SetupTemplate {
  setupFiles() {
    return this.fs.copyTmpl(
      'readme/header.md',
      'README.md',
      this.projectConfig,
    );
  }
}

export default Readme;
