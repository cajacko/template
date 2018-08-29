// @flow

import {
  runCommandInLocalNameSpacedModules,
  getProjectDir,
} from '@cajacko/template-utils';
import { NPM_NAMESPACE } from '../config/general';
import buildLibIfEnabled from './buildLibIfEnabled';

const watchLibIfEnabled = (env) => {
  if (!env.USE_LOCAL_LIBS) return Promise.resolve();

  return buildLibIfEnabled(env).then(() =>
    getProjectDir().then((projectDir) => {
      runCommandInLocalNameSpacedModules(
        NPM_NAMESPACE,
        projectDir,
        'yarn watch',
      );

      return Promise.resolve();
    }));
};

export default watchLibIfEnabled;
