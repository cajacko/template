import SetupTemplate from '../modules/SetupTemplate';

class Changelog extends SetupTemplate {
  setupFiles() {
    return this.fs.copyIfDoesNotExist('CHANGELOG.md');
  }
}

export default Changelog;
