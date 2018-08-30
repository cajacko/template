import SetupTemplate from '../modules/SetupTemplate';

class Git extends SetupTemplate {
  setupFiles() {
    this.npm.add({
      husky: { type: 'dev', version: '0.14.3' },
    });
  }
}

export default Git;
