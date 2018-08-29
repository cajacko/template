// @flow

import {
  registerCommand as UtilsRegisterCommand,
  getProjectConfig,
  getProjectEnv,
  getProjectDir,
  linkAllNameSpacedDependencies,
  runCommand,
} from '@cajacko/template-utils';
import isSymLinked from 'is-symlink';
import { join } from 'path';
import { NPM_NAMESPACE, SKIP_OPTION } from '../config/general';
import buildLibIfEnabled from './buildLibIfEnabled';
import unlinkLibs from './unlinkLibs';

const registerCommand = (command, callback, configArg) => {
  const config = typeof configArg === 'object' ? configArg : { options: [] };
  const options = config.options || [];

  const skipOptionParam = SKIP_OPTION.split('-')
    .filter(part => !!part && !!part.length)
    .reduce((name, val) => `${name}${val.replace(/^\w/, c => c.toUpperCase())}`);

  return UtilsRegisterCommand(
    command,
    (...registerArgs) =>
      Promise.all([getProjectConfig(), getProjectEnv(), getProjectDir()]).then(([projectConfig, env, projectDir]) =>
        isSymLinked(join(projectDir, 'node_modules/@cajacko/template')).then((isLinked) => {
          const run = () => callback(...registerArgs, projectConfig, env);

          if (registerArgs[0][skipOptionParam]) {
            return run();
          }

          const runAndSkip = () => {
            const fullCommand = `${process.argv.join(' ')} ${SKIP_OPTION}`;

            return runCommand(fullCommand, projectDir);
          };

          if (env.USE_LOCAL_LIBS) {
            if (isLinked === true) {
              return buildLibIfEnabled(env).then(runAndSkip);
            }

            return linkAllNameSpacedDependencies(NPM_NAMESPACE, projectDir)
              .then(() => buildLibIfEnabled(env))
              .then(runAndSkip);
          }

          if (config.ignoreUnlink) {
            return run();
          }

          if (isLinked === false) return runAndSkip();

          return unlinkLibs().then(runAndSkip);
        })),
    { options: [[SKIP_OPTION], ...options] },
  );
};

export default registerCommand;
