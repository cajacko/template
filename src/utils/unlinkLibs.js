// @flow

import { runCommand, getProjectDir } from '@cajacko/template-utils';

const unlinkLibs = () =>
  getProjectDir().then(projectDir =>
    runCommand('yarn unlink @cajacko/template', projectDir).then(() =>
      runCommand('yarn', projectDir)));

export default unlinkLibs;
