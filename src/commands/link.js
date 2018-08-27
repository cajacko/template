// @flow

import {
  linkAllNameSpacedDependencies,
  getProjectDir,
} from '@cajacko/template-utils';
import { NPM_NAMESPACE } from '../config/general';

const link = () =>
  getProjectDir().then(projectDir =>
    linkAllNameSpacedDependencies(NPM_NAMESPACE, projectDir));

// unlink just does cd projectDir && yarn unlink all @cajacko packages && yarn install

export default link;
