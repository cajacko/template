#! /usr/bin/env node

// @flow

import '@babel/polyfill';
import { processCommands } from '@cajacko/template-utils';
import registerCommand from './utils/registerCommand';
import upgrade from './commands/upgrade';
import init from './commands/init';
import test from './commands/test';
import deploy from './commands/deploy';
import start from './commands/start';

registerCommand('start', start, {
  options: [['-i, --interactive'], ['-t, --template [type]']],
});

registerCommand('init', init);
registerCommand('test', test);
registerCommand('deploy', deploy);
registerCommand('upgrade', upgrade);

registerCommand('postinstall', () => {}, { ignoreUnlink: true });

registerCommand('precommit', () => {});

processCommands(process.argv);
