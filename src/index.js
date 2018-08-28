// @flow

import { registerCommand, processCommands } from '@cajacko/template-utils';
import link from './commands/link';
import unlink from './commands/unlink';

registerCommand('link', link);
registerCommand('unlink', unlink);

processCommands(process.argv);
