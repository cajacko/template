// @flow

import { getProjectDir, git } from '@cajacko/template-utils';

const deploy = () =>
  getProjectDir()
    .then(git.hasUncommitedChanges)
    .then((hasUncommitedChanges) => {
      if (hasUncommitedChanges) {
        throw new Error("Can't deploy, there are uncommited changes");
      }
    });

export default deploy;
