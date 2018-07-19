const program = require('commander');
const Test = require('../test/Test');
const ensureSetup = require('../setup/ensureSetup');

program.command('test').action(ensureSetup((...args) => {
  const test = new Test(...args);

  return test.getTemplate().then(test.testTemplate);
}));
