// @flow

import runJest from '../utils/runJest';

/**
 * Run jest unit tests in the project
 *
 * @param {String} projectDir The path to the project
 *
 * @return {Promise} Promise that resolves if jest passes
 */
const unit = projectDir =>
  runJest('src', 'node node_modules/.bin/jest src --coverage', projectDir);

export default unit;
