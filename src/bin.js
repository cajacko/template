#! /usr/bin/env node

// @flow

import '@babel/polyfill';
import './utils/loadLogger';
import { processCommands } from '@cajacko/template-utils';
import registerCommand from './utils/registerCommand';
import upgrade from './commands/upgrade';
import init from './commands/init';
import test from './commands/test';
import deploy from './commands/deploy';
import start from './commands/start';
import build from './commands/build';
import prepare from './commands/prepare';

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
registerCommand('build', build);

registerCommand('deploy', deploy, {
  options: runOptions,
});

registerCommand('upgrade', upgrade);

registerCommand('postinstall', () => {}, { ignoreUnlink: true });

registerCommand('precommit', () => {});
registerCommand('prepare', prepare);

processCommands(process.argv);
