// @flow

import { getProjectDir } from '@cajacko/template-utils';
import initVersion from '../tests/initVersion';
import eslint from '../tests/eslint';

/**
 * Run the test suite
 *
 * @param {Object} commander The commander object
 * @param {Object} projectConfig The project config
 *
 * @return {Promise} Promise that resolves if all the tests pass
 */
const test = (commander, projectConfig) =>
  getProjectDir().then(projectDir =>
    initVersion(projectConfig).then(() => eslint(projectDir)));

export default test;
