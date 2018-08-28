// @flow

import {
  unlinkAllNameSpacedDependencies,
  getProjectDir,
} from '@cajacko/template-utils';
import { NPM_NAMESPACE } from '../config/general';

const unlink = () =>
  getProjectDir().then(projectDir =>
    unlinkAllNameSpacedDependencies(NPM_NAMESPACE, projectDir));

export default unlink;
