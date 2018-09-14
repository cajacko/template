// @flow

import {
  registerCommand as UtilsRegisterCommand,
  getProjectConfig,
  getProjectEnv,
  getProjectDir,
  linkAllNameSpacedDependencies,
  runCommand,
  killAllCommands,
  logger,
} from '@cajacko/template-utils';
import isProjectDirLinked from './isProjectDirLinked';
import { NPM_NAMESPACE, SKIP_OPTION } from '../config/general';
import buildLib from './buildLib';
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
      Promise.all([getProjectConfig(), getProjectEnv(), getProjectDir()])
        .then(([projectConfig, env, projectDir]) =>
          isProjectDirLinked().then((isLinked) => {
            const run = () => callback(...registerArgs, projectConfig, env);

            if (registerArgs[0][skipOptionParam] || env.SKIP_LINK_BUILD) {
              return run();
            }

            process.env.SKIP_LINK_BUILD = true;

            const runAndSkip = () => {
              const fullCommand = `${process.argv.join(' ')} ${SKIP_OPTION}`;

              return runCommand(fullCommand, projectDir);
            };

            if (env.USE_LOCAL_LIBS || env.NO_ENV_FILE) {
              if (isLinked === true) {
                return buildLib(env.NO_ENV_FILE).then(runAndSkip);
              }

              return linkAllNameSpacedDependencies(NPM_NAMESPACE, projectDir)
                .then(() => buildLib())
                .catch((e) => {
                  logger.warn(e);
                })
                .then(runAndSkip);
            }

            if (config.ignoreUnlink) {
              return run();
            }

            if (isLinked === false) return runAndSkip();

            return unlinkLibs().then(runAndSkip);
          }))
        .catch(e => e)
        .then((e) => {
          killAllCommands();

          if (e instanceof Error) {
            logger.error(e);
          }

          process.exit(0);
        }),
    { options: [[SKIP_OPTION], ...options] }
  );
};

export default registerCommand;
