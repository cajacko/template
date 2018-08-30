// @flow

import { getProjectDir, getProjectConfig, git } from '@cajacko/template-utils';
import { join } from 'path';
import SetupRunner from '../modules/SetupRunner';

const init = () =>
  Promise.all([
    getProjectDir(),
    getProjectConfig(),
    git.getLastVersionTag(join(__dirname, '../../')),
  ]).then(([projectDir, projectConfig, lastVersion]) => {
    const setupRunner = new SetupRunner(projectDir, projectConfig, lastVersion);

    return setupRunner.runSteps();
  });

export default init;
