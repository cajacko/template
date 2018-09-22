// @flow

// @flow

import { runCommand } from '@cajacko/template-utils';

/**
 * Run jest in the project
 *
 * @param {String} projectDir The path to the project
 *
 * @return {Promise} Promise that resolves if jest passes
 */
const jest = projectDir =>
  runCommand('node node_modules/.bin/jest', projectDir);

export default jest;
