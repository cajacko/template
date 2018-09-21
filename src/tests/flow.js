// @flow

import { runCommand } from '@cajacko/template-utils';

/**
 * Run flow in the project
 *
 * @param {String} projectDir The path to the project
 *
 * @return {Promise} Promise that resolves if flow passes
 */
const flow = projectDir =>
  runCommand('node node_modules/.bin/flow', projectDir);

export default flow;
