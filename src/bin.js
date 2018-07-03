const program = require('commander');

exports.setVersion = version =>
  program.version(version).arguments('<cmd> [options]');

// require('./init');
// require('./add');
// require('./start');
// require('./build');
// require('./deploy');

program.command('*', { noHelp: true }).action(() => {
  console.error('\nUnknown command given! See the help below');
  program.outputHelp();
  process.exit(1);
});

exports.run = () => program.parse(process.argv);
