// @flow

import {
  copyAndWatch as UCopyAndWatch,
  runCommand,
  logger,
} from '@cajacko/template-utils';
import { join } from 'path';

const copyAndWatch = (src, dest, optionsArg = {}) => {
  const { transpile, ...options } = optionsArg;

  if (transpile) {
    const command = `yarn babel ${src} --out-dir ${dest} --presets=react,env,flow --plugins=transform-react-jsx-source,transform-object-rest-spread,babel-plugin-styled-components`;
    const path = join(__dirname, '../../');

    return runCommand(command, path, { noLog: true }).then(() => {
      runCommand(`${command} --watch --skip-initial-build`, path).catch(() => {
        if (options.exitOnError) {
          logger.error(`Watch failed between "${src}" and "${dest}"`);
          process.exit(1);
        }
      });
    });
  }

  return UCopyAndWatch(src, dest, options);
};

export default copyAndWatch;
