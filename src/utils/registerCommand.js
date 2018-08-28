// @flow

import {
  registerCommand as UtilsRegisterCommand,
  getProjectConfig,
  getProjectEnv,
} from '@cajacko/template-utils';

const registerCommand = (command, callback, ...args) =>
  UtilsRegisterCommand(
    command,
    (...registerArgs) =>
      Promise.all([getProjectConfig(), getProjectEnv()]).then(([projectConfig, env]) => callback(...registerArgs, projectConfig, env)),
    ...args,
  );

export default registerCommand;
