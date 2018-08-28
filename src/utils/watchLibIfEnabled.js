// @flow

import {
  runCommandInLocalNameSpacedModules,
  getProjectDir,
} from '@cajacko/template-utils';
import { NPM_NAMESPACE } from '../config/general';

const watchLibIfEnabled = ({ USE_LOCAL_LIBS }) => {
  if (!USE_LOCAL_LIBS) return Promise.resolve();

  return getProjectDir().then(projectDir =>
    runCommandInLocalNameSpacedModules(
      NPM_NAMESPACE,
      projectDir,
      'yarn build',
    ).then(() => {
      runCommandInLocalNameSpacedModules(
        NPM_NAMESPACE,
        projectDir,
        'yarn watch',
      );

      return Promise.resolve();
    }));
};

export default watchLibIfEnabled;
