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

const runOptions = [
  ['-i, --interactive'],
  ['-t, --template [type]'],
  ['-o, --offline'],
  ['-r, --reset'],
];

registerCommand('start', start, {
  options: runOptions,
});

registerCommand('init', init);
registerCommand('test', test);

registerCommand('deploy', deploy, {
  options: runOptions,
});

registerCommand('upgrade', upgrade);

registerCommand('postinstall', () => {}, { ignoreUnlink: true });

registerCommand('precommit', () => {});

processCommands(process.argv);
