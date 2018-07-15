const program = require('commander');
const Start = require('../start/Start');
const ensureSetup = require('../setup/ensureSetup');

program.command('start').action(ensureSetup((...args) => {
  const start = new Start(...args);

  return start.getTemplateToStart().then(start.startTemplate);
}));
