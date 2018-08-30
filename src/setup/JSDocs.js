import SetupTemplate from '../modules/SetupTemplate';

class JSDocs extends SetupTemplate {
  setupFiles() {
    const promises = [];

    promises.push(this.fs.copy('jsdoc.json'));

    promises.push(this.npm.add({
      jsdoc: { type: 'dev', version: '3.5.5' },
    }));

    return Promise.all(promises);
  }
}

export default JSDocs;
