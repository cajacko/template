// @flow

import { runCommand } from '@cajacko/template-utils';

/**
 * Run eslint in the project
 *
 * @param {String} projectDir The path to the project
 *
 * @return {Promise} Promise that resolves if eslint passes
 */
const eslint = projectDir =>
  runCommand('node node_modules/.bin/eslint src', projectDir);

export default eslint;
