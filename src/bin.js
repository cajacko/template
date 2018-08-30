#! /usr/bin/env node

// @flow

import { processCommands } from '@cajacko/template-utils';
import registerCommand from './utils/registerCommand';
import upgrade from './commands/upgrade';
import init from './commands/init';
import test from './commands/test';

registerCommand('init', init);
registerCommand('test', test);
registerCommand('upgrade', upgrade);

registerCommand('start', () => {
  console.log('START');
});

registerCommand('deploy', () => {
  console.log('DEPLOY');
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
