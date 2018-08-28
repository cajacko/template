// @flow

import {
  registerCommand as UtilsRegisterCommand,
  getProjectConfig,
  getProjectEnv,
  getProjectDir,
  linkAllNameSpacedDependencies,
  unlinkAllNameSpacedDependencies,
} from '@cajacko/template-utils';
import { NPM_NAMESPACE } from '../config/general';

const registerCommand = (command, callback, ...args) =>
  UtilsRegisterCommand(
    command,
    (...registerArgs) =>
      Promise.all([getProjectConfig(), getProjectEnv(), getProjectDir()]).then(([projectConfig, env, projectDir]) => {
        const run = () => callback(...registerArgs, projectConfig, env);

        if (env.USE_LOCAL_LIBS) {
          return linkAllNameSpacedDependencies(
            NPM_NAMESPACE,
            projectDir,
          ).then(run);
        }

        return unlinkAllNameSpacedDependencies(
          NPM_NAMESPACE,
          projectDir,
        ).then(run);
      }),
    ...args,
  );

export default registerCommand;
