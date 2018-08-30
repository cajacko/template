// @flow

import Setup from '../modules/Setup';

const init = (...args) => {
  const setup = new Setup(...args);

  return setup.runSteps();
};

export default init;
