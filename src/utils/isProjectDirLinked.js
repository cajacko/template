// @flow

import { getProjectDir, isSymLink } from '@cajacko/template-utils';
import { join } from 'path';

/**
 * Is the project sym linked to everything it should be, if we're developing
 * the templates
 *
 * @return {Promise} Promise that resolves with tru or false
 */
const isProjectDirLinked = () =>
  getProjectDir()
    .then(projectDir =>
      Promise.all([
        isSymLink(join(projectDir, 'node_modules/@cajacko/template')),
        isSymLink(join(__dirname, '../../node_modules/@cajacko/template-utils')),
        isSymLink(join(projectDir, 'node_modules/@cajacko/lib')),
      ]))
    .then(([link1, link2, link3]) => link1 && link2 && link3)
    .catch(() => false);

export default isProjectDirLinked;
