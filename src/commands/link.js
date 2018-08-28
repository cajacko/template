// @flow

import {
  linkAllNameSpacedDependencies,
  getProjectDir,
} from '@cajacko/template-utils';
import { NPM_NAMESPACE } from '../config/general';

const link = () =>
  getProjectDir().then(projectDir =>
    linkAllNameSpacedDependencies(NPM_NAMESPACE, projectDir));

export default link;