// @flow

import {
  runCommandInLocalNameSpacedModules,
  getProjectDir,
  logger,
} from '@cajacko/template-utils';
import { NPM_NAMESPACE } from '../config/general';

const buildLibIfEnabled = ({ USE_LOCAL_LIBS }) => {
  if (!USE_LOCAL_LIBS) return Promise.resolve();

  logger.debug('Using local libs');
  logger.debug('- Building local libs');
  return getProjectDir()
    .then(projectDir =>
      runCommandInLocalNameSpacedModules(
        NPM_NAMESPACE,
        projectDir,
        'yarn build',
        { noLog: true },
      ))
    .then(() => {
      logger.debug('- Finished building local libs');
    });
};

export default buildLibIfEnabled;
