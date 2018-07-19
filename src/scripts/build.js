const program = require('commander');
const Build = require('../build/Build');

program.command('build').action((...args) => {
  const build = new Build(...args);

  return build.getTemplate().then(build.buildTemplate);
});
