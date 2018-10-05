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
import isAuthor from './isAuthor';

/**
 * Finish the script, if an error is supplied will exit with an error status
 * code
 *
 * @param {Error} e Optional error
 *
 * @return {Void} No return value
 */
const finish = (e) => {
  killAllCommands();

  if (e) {
    if (e instanceof Error) {
      logger.error(e);
    }

    process.exit(1);
  }

  process.exit(0);
};

/**
 * Register a command that can be used via cli. Pass in the callback and some
 * optional options.
 *
 * If we have local versions of the template library we'll check to see if we
 * should compile them first. So we are using the latest. Then we'll run the
 * commands
 *
 * @param {String} command The command to register
 * @param {Function} callback The function to run when the command is called
 * @param {Object} [configArg] Options for registering the command
 *
 * @return {Object} The commander instance
 */
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
            /**
             * Run the original command with all the correct params
             *
             * @return {Promise} Promise that resolves when the command has
             * finished
             */
            const run = () => callback(...registerArgs, projectConfig, env);

            if (registerArgs[0][skipOptionParam] || env.SKIP_LINK_BUILD) {
              return run();
            }

            process.env.SKIP_LINK_BUILD = true;

            /**
             * Run the original command, passing in the skip flag so we don't
             * compile the libs again
             *
             * @return {Promise} Promise that resolves when the command has
             * finished
             */
            const runAndSkip = () => {
              const fullCommand = `${process.argv.join(' ')} ${SKIP_OPTION}`;

              return runCommand(fullCommand, projectDir).catch(() =>
                finish(true));
            };

            if (env.USE_LOCAL_LIBS || (env.NO_ENV_FILE && isAuthor())) {
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
        .then(() => finish()),
    { options: [[SKIP_OPTION], ...options] },
    finish
  );
};

export default registerCommand;
