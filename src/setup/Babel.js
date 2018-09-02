import SetupTemplate from '../modules/SetupTemplate';

class Babel extends SetupTemplate {
  setupFiles() {
    const promises = [];

    promises.push(this.npm.add({
      'babel-plugin-styled-components': { type: 'dev', version: '1.6.0' },
      'babel-plugin-transform-object-rest-spread': {
        type: 'dev',
        version: '6.26.0',
      },
      'babel-plugin-transform-react-jsx-source': {
        type: 'dev',
        version: '6.22.0',
      },
      'babel-preset-env': { type: 'dev', version: '1.6.1' },
      'babel-preset-flow': { type: 'dev', version: '6.23.0' },
      'babel-preset-react': { type: 'dev', version: '6.24.1' },
    }));

    return Promise.all(promises);
  }
}

export default Babel;
