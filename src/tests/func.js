// @flow

import runJest from '../utils/runJest';

/**
 * Run jest func tests in the project
 *
 * @param {String} projectDir The path to the project
 *
 * @return {Promise} Promise that resolves if jest passes
 */
const unit = projectDir =>
  runJest('features', 'node node_modules/.bin/jest features', projectDir);

export default unit;
