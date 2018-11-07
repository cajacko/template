#! /usr/bin/env node

// @flow
// Ignoring import/first as we need to ensure the logger is loaded before
// anything else has loaded
/* eslint import/first: 0 */

import '@babel/polyfill';
import './utils/loadLogger';
import { processCommands } from '@cajacko/template-utils';
import registerCommand from './utils/registerCommand';
import upgrade from './commands/upgrade';
import init from './commands/init';
import test from './commands/test';
import runBasicCommand from './utils/runBasicCommand';

const runOptions = [
  ['-i, --interactive'],
  ['-t, --template [type]'],
  ['-o, --offline'],
  ['-r, --reset'],
  ['--ios'],
  ['--android'],
  ['--skip-prepare'],
];

registerCommand('init', init);

registerCommand('start', runBasicCommand('start'), {
  options: runOptions,
});

registerCommand('test', test, {
  options: [['-i, --interactive'], ['-t, --type [type]']],
});

registerCommand('build', runBasicCommand('build'));

registerCommand('deploy', runBasicCommand('deploy'), {
  options: runOptions.concat([
    ['--reset-keys'],
    ['--skip-build'],
    ['--deploy-env [deployEnv]'],
  ]),
});

registerCommand('upgrade', upgrade);

registerCommand('postinstall', () => {}, { ignoreUnlink: true });

registerCommand('precommit', () => {});
registerCommand('prepare', runBasicCommand('prepare'));

processCommands(process.argv);
