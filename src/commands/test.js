// @flow

import { getProjectDir } from '@cajacko/template-utils';
import initVersion from '../tests/initVersion';
import eslint from '../tests/eslint';

const test = (commander, projectConfig, env) =>
  getProjectDir().then((projectDir) => {
    const args = [commander, projectConfig, env, projectDir];

    return initVersion(...args).then(() => eslint(...args));
  });

export default test;
