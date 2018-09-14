// @flow

import { version } from '../../package.json';

/**
 * Check if the project config is up to date. Done by comparing the last time
 * init was run against the current template version
 *
 * @param {Object} projectConfig The project config object
 *
 * @return {Promise} Promise that resolves if the init version is up to date
 */
const initVersion = (projectConfig) => {
  if (projectConfig.templateInitVersion !== version) {
    throw new Error(`Project is out of date. Run "yarn run init" to update the project config.\nYou are on version ${
      projectConfig.templateInitVersion
    }, template is on ${version}`);
  }

  return Promise.resolve();
};

export default initVersion;
