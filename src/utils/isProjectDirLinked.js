// @flow

import { getProjectDir } from '@cajacko/template-utils';
import { join } from 'path';
import isSymLinked from 'is-symlink';

const isProjectDirLinked = () =>
  getProjectDir()
    .then(projectDir =>
      Promise.all([
        isSymLinked(join(projectDir, 'node_modules/@cajacko/template')),
        isSymLinked(join(__dirname, '../../node_modules/@cajacko/template-utils')),
      ]))
    .then(([link1, link2]) => link1 && link2);

export default isProjectDirLinked;
