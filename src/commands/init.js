// @flow

import { getProjectDir, getProjectConfig } from '@cajacko/template-utils';
import SetupRunner from '../modules/SetupRunner';

const init = () =>
  Promise.all([getProjectDir(), getProjectConfig()]).then(([projectDir, projectConfig]) => {
    const setupRunner = new SetupRunner(projectDir, projectConfig);

    return setupRunner.runSteps();
  });

export default init;
