const Runner = require('./Runner');
const globals = require('../utils/globals');

module.exports = (options) => {
  let ensureSetupOnly = false;

  if (typeof options === 'object') {
    ({ ensureSetupOnly } = options);
  }

  const setupFiles = globals.get('setupFiles');

  const runner = new Runner(setupFiles, ensureSetupOnly);

  return runner.run();
};
