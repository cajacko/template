// @flow

import { processCommands } from '@cajacko/template-utils';
import registerCommand from './utils/registerCommand';
import start from './commands/start';
import { version } from '../package.json';

console.log(version);

registerCommand('start', start);

registerCommand('test', () => {
  console.log('TEST');
});

registerCommand('deploy', () => {
  console.log('DEPLOY');
});

registerCommand('upgrade', () => {
  console.log('UPRADE');
});

registerCommand(
  'postinstall',
  () => {
    console.log('POSTINSTALL');
  },
  { ignoreUnlink: true },
);

registerCommand('precommit', () => {
  console.log('PRECOMMIT');
});

processCommands(process.argv);
