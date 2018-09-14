// @flow

import { getProjectDir } from '@cajacko/template-utils';
import TemplateRunner from '../modules/TemplateRunner';

const build = (commander, projectConfig, env) =>
  getProjectDir().then((projectDir) => {
    const templateRunner = new TemplateRunner(
      commander,
      projectConfig,
      env,
      projectDir,
    );

    return templateRunner.build();
  });

export default build;
