// @flow

// @flow

import { runCommand } from '@cajacko/template-utils';

/**
 * Run jest unit tests in the project
 *
 * @param {String} projectDir The path to the project
 *
 * @return {Promise} Promise that resolves if jest passes
 */
const unit = projectDir =>
  runCommand('node node_modules/.bin/jest src --coverage', projectDir);

export default unit;
