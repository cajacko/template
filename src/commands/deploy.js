// @flow

import { getProjectDir } from '@cajacko/template-utils';
import TemplateRunner from '../modules/TemplateRunner';

const deploy = (commander, projectConfig, env) =>
  // getProjectDir()
  //   .then(git.hasUncommitedChanges)
  //   .then((hasUncommitedChanges) => {
  //     if (hasUncommitedChanges) {
  //       throw new Error("Can't deploy, there are uncommited changes");
  //     }
  //   });
  getProjectDir().then((projectDir) => {
    const templateRunner = new TemplateRunner(
      commander,
      projectConfig,
      env,
      projectDir,
    );

    return templateRunner.deploy();
  });

export default deploy;
