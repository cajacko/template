import SetupTemplate from '../modules/SetupTemplate';

class GitAttributes extends SetupTemplate {
  setupFiles() {
    return this.fs.copy('.gitattributes');
  }
}

export default GitAttributes;
