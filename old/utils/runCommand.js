const spawn = require('react-dev-utils/crossSpawn');

module.exports = (command, cwd = process.cwd(), opts) =>
  new Promise((resolve, reject) => {
    try {
      const commands = command.split(' ').filter(string => string !== '');
      const firstCommand = commands.splice(0, 1)[0];

      process.chdir(cwd);

      const options = Object.assign(
        {
          stdio: 'inherit',
        },
        opts || {},
      );

      if (!options.cwd) {
        options.cwd = cwd;
      }

      const ls = spawn(firstCommand, commands, options);

      ls.on('close', (code) => {
        if (code) {
          reject(new Error(`child process exited with code ${code}`));
        } else {
          resolve();
        }
      });
    } catch (e) {
      reject(e);
    }
  });
