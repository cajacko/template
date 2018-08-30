// @flow

import {
  runCommandInLocalNameSpacedModules,
  getProjectDir,
  logger,
} from '@cajacko/template-utils';
import { NPM_NAMESPACE } from '../config/general';

const buildLib = (useFromSettings) => {
  logger.debug('Using local libs');
  logger.debug('- Building local libs');
  return getProjectDir()
    .then(projectDir =>
      runCommandInLocalNameSpacedModules(
        NPM_NAMESPACE,
        projectDir,
        'yarn build',
        { noLog: true },
        useFromSettings,
      ))
    .then(() => {
      logger.debug('- Finished building local libs');
    });
};

export default buildLib;
