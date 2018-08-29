// @flow

import {
  registerCommand as UtilsRegisterCommand,
  getProjectConfig,
  getProjectEnv,
  getProjectDir,
  linkAllNameSpacedDependencies,
  runCommand,
  setSettings,
  getSettings,
} from '@cajacko/template-utils';
import {
  NPM_NAMESPACE,
  SKIP_OPTION,
  IS_PROJECT_DIR_LINKED_OPTION_KEY,
} from '../config/general';
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
      Promise.all([getProjectConfig(), getProjectEnv(), getProjectDir()]).then(([projectConfig, env, projectDir]) => {
        const linkSettingsPath = [
          IS_PROJECT_DIR_LINKED_OPTION_KEY,
          projectDir,
        ];

        return getSettings(linkSettingsPath).then((isLinked) => {
          const run = () => callback(...registerArgs, projectConfig, env);

          const setLinkStatus = val => () =>
            setSettings(val, linkSettingsPath);

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
              .then(setLinkStatus(true))
              .then(runAndSkip);
          }

          if (config.ignoreUnlink) {
            return run();
          }

          if (isLinked === false) return runAndSkip();

          return unlinkLibs()
            .then(setLinkStatus(false))
            .then(runAndSkip);
        });
      }),
    { options: [[SKIP_OPTION], ...options] },
  );
};

export default registerCommand;
