// @flow

import { runCommandInLocalNameSpacedModules } from '@cajacko/template-utils';
import { NPM_NAMESPACE } from '../config/general';
import buildLibIfEnabled from './buildLibIfEnabled';

const watchLibIfEnabled = ({ USE_LOCAL_LIBS }) => {
  if (!USE_LOCAL_LIBS) return Promise.resolve();

  return buildLibIfEnabled().then(() => {
    runCommandInLocalNameSpacedModules(NPM_NAMESPACE, projectDir, 'yarn watch');

    return Promise.resolve();
  });
};

export default watchLibIfEnabled;
