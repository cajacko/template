// @flow

import {
  getProjectDir,
  getProjectConfig,
  getLastLocalModuleVersion,
} from '@cajacko/template-utils';
import SetupRunner from '../modules/SetupRunner';

const init = () =>
  Promise.all([
    getProjectDir(),
    getProjectConfig(),
    getLastLocalModuleVersion('@cajacko/template'),
    getLastLocalModuleVersion('@cajacko/lib'),
  ]).then(([projectDir, projectConfig, lastTemplateVersion, lastLibVersion]) => {
    const setupRunner = new SetupRunner(
      projectDir,
      projectConfig,
      lastTemplateVersion,
      lastLibVersion,
    );

    return setupRunner.runSteps();
  });

export default init;
