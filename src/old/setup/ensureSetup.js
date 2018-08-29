const runSetup = require('../setup/run');

module.exports = callback => (...args) =>
  runSetup({ ensureSetupOnly: true }).then(() => callback(...args));
