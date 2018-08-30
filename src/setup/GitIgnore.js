import SetupTemplate from '../modules/SetupTemplate';

class GitIgnore extends SetupTemplate {
  setupFiles() {
    return this.fs.copy('.gitignore');
  }
}

export default GitIgnore;
