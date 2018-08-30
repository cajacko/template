import SetupTemplate from '../modules/SetupTemplate';

class Example extends SetupTemplate {
  setupFiles() {
    return Promise.all([
      this.fs.copyIfDoesNotExist('example/entry.js', 'src/entry.js'),
      this.fs.copyIfDoesNotExist('example/project.json', 'project.json'),
    ]);
  }
}

export default Example;
