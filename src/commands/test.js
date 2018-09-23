// @flow

import { getProjectDir } from '@cajacko/template-utils';
import initVersion from '../tests/initVersion';
import eslint from '../tests/eslint';
import flow from '../tests/flow';
import unit from '../tests/unit';
import func from '../tests/func';

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
    initVersion(projectConfig)
      .then(() => eslint(projectDir))
      .then(() => flow(projectDir))
      .then(() => unit(projectDir))
      .then(() => func(projectDir)));

export default test;
