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

const qs = [
  'Do you have branch permission setup correctly in GitHub',
  'Have you setup travis for this project?',
  "Is travis configured to only run on PR's",
];

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

          return setupRunner.runSteps();
        }));
    })
    .then(() =>
      ask(qs.map((message, i) => ({
        type: 'confirm',
        name: `qs-${i}`,
        message,
      }))));

export default init;
