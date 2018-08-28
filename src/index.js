// @flow

import { processCommands } from '@cajacko/template-utils';
import registerCommand from './utils/registerCommand';
import start from './commands/start';

registerCommand('start', start);

processCommands(process.argv);
