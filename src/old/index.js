/* eslint global-require: 0 */

require('babel-register');

const program = require('commander');
const RunnerTemplate = require('./setup/RunnerTemplate');
const ProjectTemplate = require('./setup/ProjectTemplate');
const globals = require('./utils/globals');
const StartTemplate = require('./start/StartTemplate');

globals.set('setupFiles', {});
globals.set('tmplPath', null);

exports.setPackageName = (name) => {
  globals.set('packageName', name);
};

exports.setVersion = (version) => {
  globals.set('packageVersion', version);
  return program.version(version).arguments('<cmd> [options]');
};

exports.setSetupFiles = (files) => {
  globals.set('setupFiles', files);
};

exports.setTmplPath = (path) => {
  globals.set('tmplPath', path);
};

exports.setTemplateClasses = (classes) => {
  globals.set('templateClasses', classes);
};

exports.run = () => {
  require('./scripts/init');
  require('./scripts/start');
  require('./scripts/build');
  require('./scripts/test');
  require('./scripts/postinstall');
  require('./scripts/precommit');

  program.command('*', { noHelp: true }).action(() => {
    console.error('\nUnknown command given! See the help below');
    program.outputHelp();
    process.exit(1);
  });

  program.parse(process.argv);
};

exports.RunnerTemplate = RunnerTemplate;
exports.ProjectTemplate = ProjectTemplate;
exports.StartTemplate = StartTemplate;
