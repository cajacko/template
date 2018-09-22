// @flow
import SetupTemplate from '../modules/SetupTemplate';

const babelConfig = {
  presets: ['env', 'flow', 'react'],
  plugins: [
    'transform-react-jsx-source',
    'babel-plugin-styled-components',
    'transform-object-rest-spread',
  ],
};

/**
 * Setup babel in the project
 */
class Babel extends SetupTemplate {
  /**
   * During the setup phase add the babel dependencies and files
   *
   * @return {Void} No return value
   */
  setupFiles() {
    const promises = [];

    if (!this.isSelf) {
      promises.push(this.fs.writeJSON(babelConfig, '.babelrc'));

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
    }

    return Promise.all(promises);
  }
}

export default Babel;
