// @flow

import {
  registerCommand as UtilsRegisterCommand,
  getProjectConfig,
  getProjectEnv,
  getProjectDir,
  linkAllNameSpacedDependencies,
  unlinkAllNameSpacedDependencies,
  runCommand,
} from '@cajacko/template-utils';
import { NPM_NAMESPACE } from '../config/general';
import buildLibIfEnabled from './buildLibIfEnabled';

const registerCommand = (command, callback, options = []) =>
  UtilsRegisterCommand(
    command,
    (...registerArgs) =>
      Promise.all([getProjectConfig(), getProjectEnv(), getProjectDir()]).then(([projectConfig, env, projectDir]) => {
        const run = () => callback(...registerArgs, projectConfig, env);

        if (env.USE_LOCAL_LIBS) {
          if (registerArgs[0].skipInitBuild) {
            return run();
          }

          return linkAllNameSpacedDependencies(NPM_NAMESPACE, projectDir)
            .then(() => buildLibIfEnabled(env))
            .then(() => {
              const fullCommand = `${process.argv.join(' ')} --skip-init-build`;

              return runCommand(fullCommand, projectDir);
            });
        }

        return unlinkAllNameSpacedDependencies(
          NPM_NAMESPACE,
          projectDir,
        ).then(run);
      }),
    { options: [['--skip-init-build'], ...options] },
  );

export default registerCommand;
