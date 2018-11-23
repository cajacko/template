// @flow

import {
  getProjectDir,
  getProjectConfig,
  getLastLocalModuleVersion,
  logger,
  ask,
} from '@cajacko/template-utils';
import { copy } from 'fs-extra';
import { join } from 'path';
import SetupRunner from '../modules/SetupRunner';

/**
 * Initialise the project
 *
 * @return {Promise} Resolves when the initialisation has finished
 */
const init = () =>
  Promise.all([getProjectDir(), getProjectConfig()])
    .then(([projectDir, projectConfig]) => {
      if (!projectConfig) {
        logger.log('No project.json found in the project dir. Creating one now.');

        return copy(
          join(__dirname, '../../files/example/project.json'),
          join(projectDir, 'project.json')
        ).then(() => {
          logger.log('Created project.json. Please check it is accurate before running "init" again');
        });
      }

      return getLastLocalModuleVersion('@cajacko/template').then(lastTemplateVersion =>
        getLastLocalModuleVersion('@cajacko/lib').then((lastLibVersion) => {
          const setupRunner = new SetupRunner(
            projectDir,
            projectConfig,
            lastTemplateVersion,
            lastLibVersion
          );

          return Promise.resolve();
          return setupRunner.runSteps();
        }));
    })
    .then(() =>
      ask([
        {
          type: 'confirm',
          message: 'Do you have branch permission setup correctly in GitHub',
          name: 'branchProtection',
        },
      ]));

export default init;
