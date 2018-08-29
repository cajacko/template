const program = require('commander');
const runSetup = require('../setup/run');

program.command('init').action(runSetup);
