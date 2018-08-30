// @flow

import { processCommands } from '@cajacko/template-utils';
import registerCommand from '../utils/registerCommand';
import upgrade from './upgrade';

registerCommand('init', () => {
  console.log('INIT');
});

registerCommand('start', () => {
  console.log('START');
});

registerCommand('test', () => {
  console.log('TEST');
});

registerCommand('deploy', () => {
  console.log('DEPLOY');
});

registerCommand('upgrade', upgrade);

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
