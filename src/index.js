const program = require('commander');
const RunnerTemplate = require('./setup/RunnerTemplate');
const ProjectTemplate = require('./setup/ProjectTemplate');
const globals = require('./utils/globals');

globals.set('setupFiles', {});
globals.set('tmplPath', null);

exports.setVersion = version =>
  program.version(version).arguments('<cmd> [options]');

exports.setSetupFiles = (files) => {
  globals.set('setupFiles', files);
};

exports.setTmplPath = (path) => {
  globals.set('tmplPath', path);
};

exports.run = () => {
  require('./scripts/init');

  program.command('*', { noHelp: true }).action(() => {
    console.error('\nUnknown command given! See the help below');
    program.outputHelp();
    process.exit(1);
  });

  program.parse(process.argv);
};

exports.RunnerTemplate = RunnerTemplate;
exports.ProjectTemplate = ProjectTemplate;
