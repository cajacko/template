// @flow

import { version } from '../../package.json';

const initVersion = (commander, projectConfig) => {
  if (projectConfig.templateInitVersion !== version) {
    throw new Error(`Project is out of date. Run "yarn run init" to update the project config.\nYou are on version ${
      projectConfig.templateInitVersion
    }, template is on ${version}`);
  }

  return Promise.resolve();
};

export default initVersion;
