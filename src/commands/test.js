// @flow

import { getProjectDir, ask } from '@cajacko/template-utils';
import initVersion from '../tests/initVersion';
import eslint from '../tests/eslint';
import flow from '../tests/flow';
import unit from '../tests/unit';
import func from '../tests/func';

const tests = {
  'init-version': initVersion,
  eslint,
  flow,
  unit,
  func,
};

/**
 * Run the test suite
 *
 * @param {Object} commander The commander object
 * @param {Object} projectConfig The project config
 *
 * @return {Promise} Promise that resolves if all the tests pass
 */
const test = (commander, projectConfig) =>
  getProjectDir().then((projectDir) => {
    /**
     * Get all the types of tests to run
     *
     * @return {Promise} Promise that resolves with the types to run
     */
    const getTypes = () => {
      if (commander.type) return Promise.resolve(commander.type.split(','));
      if (!commander.interactive) return Promise.resolve(Object.keys(tests));

      return ask({
        type: 'checkbox',
        choices: Object.keys(tests),
      });
    };

    return getTypes().then((types) => {
      const promises = [];

      Object.keys(tests).forEach((key) => {
        if (types.includes(key)) {
          promises.push(() => tests[key](projectDir, projectConfig));
        }
      });

      /**
       * Loop through all the promises
       *
       * @param {Number} i The index in the array we're processing
       *
       * @return {Promise} Promise that resolves if all tests pass
       */
      const loop = (i = 0) => {
        const cb = promises[i];

        if (!cb) return Promise.resolve();

        return cb().then(() => loop(i + 1));
      };

      return loop();
    });
  });

export default test;
