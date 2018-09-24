// @flow

import {
  runCommand,
  getProjectDir,
  getPackageJSONFromDir,
} from '@cajacko/template-utils';
import { join } from 'path';
import globby from 'globby';

/**
 * Run a jest test without failing if no tests are found
 *
 * @param {String} dir The dir in the project we're going to be testing
 * @param  {...any} args The rest of the params to pass to runCommand
 *
 * @return {Promise} Promise that resolves if jest passes
 */
const runJest = (dir, ...args) =>
  getProjectDir().then(projectDir =>
    getPackageJSONFromDir(projectDir).then(({ jest }) => {
      const globs = [];

      /**
       * Parse the jest template tags from the string
       *
       * @param {String} string The string to parse
       *
       * @return {String} The parsed string
       */
      const parse = (string) => {
        if (!string.includes('<rootDir>')) return string;

        return join(projectDir, string.replace('<rootDir>', ''));
      };

      const entryDir = join(projectDir, dir);

      if (jest) {
        if (jest.testMatch) {
          jest.testMatch.forEach((match) => {
            const parsedMatch = parse(match);

            if (parsedMatch.includes(entryDir)) {
              globs.push(parsedMatch);
            }
          });
        }

        if (jest.testPathIgnorePatterns) {
          jest.testPathIgnorePatterns.forEach((ignore) => {
            const parsedIgnore = parse(ignore);

            globs.push(`!${parsedIgnore}`);
          });
        }
      }

      if (!globs.length) return runCommand(...args);

      return globby(globs).then((paths) => {
        if (!paths || !paths.length) {
          logger.log('Jest found no tests to run');
          return Promise.resolve();
        }

        return runCommand(...args);
      });
    }));

export default runJest;
