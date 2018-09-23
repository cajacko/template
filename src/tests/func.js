// @flow

// @flow

import { runCommand } from '@cajacko/template-utils';

/**
 * Run jest func tests in the project
 *
 * @param {String} projectDir The path to the project
 *
 * @return {Promise} Promise that resolves if jest passes
 */
const unit = projectDir =>
  runCommand('node node_modules/.bin/jest features', projectDir);

export default unit;
