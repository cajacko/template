// @flow

import { getProjectDir } from '@cajacko/template-utils';
import type {
  Commander,
  ProjectConfig,
  Env,
} from '@cajacko/template-utils/lib/types';
import TemplateRunner from '../modules/TemplateRunner';
import type { Command } from '../types';

/**
 * Helper for running a basic command. Basically just passes in the required
 * constructor args to TemplateRunner
 *
 * @param {String} command The command to run
 *
 * @return {Function} Func to be passed into the register command func
 */
const runBasicCommand = (command: Command) => (
  commander: Commander,
  projectConfig: ProjectConfig,
  env: Env
) =>
  getProjectDir().then((projectDir) => {
    const templateRunner = new TemplateRunner(
      commander,
      projectConfig,
      env,
      projectDir
    );

    return templateRunner.runCommand(command);
  });

export default runBasicCommand;
