// @flow

import { getProjectDir } from '@cajacko/template-utils';
import SetupRunner from '../modules/SetupRunner';

const init = () =>
  getProjectDir().then((projectDir) => {
    const setupRunner = new SetupRunner(projectDir);

    return setupRunner.runSteps();
  });

export default init;
