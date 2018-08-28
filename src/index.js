// @flow

import { registerCommand } from '@cajacko/template-utils';
import link from './commands/link';
import unlink from './commands/unlink';

registerCommand('link', link);
registerCommand('unlink', unlink);
