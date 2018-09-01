// @flow

import { copyAndWatch as UCopyAndWatch } from '@cajacko/template-utils';

const copyAndWatch = (src, dest, optionsArg = {}) => {
  const { transpile, ...options } = optionsArg;

  if (transpile) {
    // throw new Error('TRANSPILE');
  }

  return UCopyAndWatch(src, dest, options);
};

export default copyAndWatch;
