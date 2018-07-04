const Runner = require('./Runner');
const globals = require('../utils/globals');

module.exports = () => {
  const setupFiles = globals.get('setupFiles');

  const runner = new Runner(setupFiles);

  return runner.run();
};
