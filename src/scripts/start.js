const program = require('commander');
const Start = require('../start/Start');

program.command('start').action((...args) => {
  const start = new Start(...args);

  return start.getTemplateToStart().then(start.startTemplate);
});
