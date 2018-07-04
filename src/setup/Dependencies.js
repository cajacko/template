const Utils = require('./Utils');

class Dependencies extends Utils {
  constructor() {
    super();

    this.nodeModules = {};
  }

  installDependencies() {
    const nodeModulesCommands = {};

    Object.keys(this.nodeModules).forEach((key) => {
      const { type, version } = this.nodeModules[key];
      const finalType = type || 'dependency';

      if (!nodeModulesCommands[finalType]) nodeModulesCommands[finalType] = '';

      nodeModulesCommands[finalType] = `${
        nodeModulesCommands[finalType]
      } ${key}@${version}`;
    });

    const promises = [];

    Object.keys(nodeModulesCommands).forEach((key) => {
      let command = 'yarn add';

      if (key !== 'dependency') command = `${command} --${key}`;

      command = `${command} ${nodeModulesCommands[key]}`;

      promises.push(() => this.runCommand(command, this.getDestPath()));
    });

    return this.promiseQueue(promises);
  }

  addNodeModules(nodeModules) {
    this.nodeModules = { ...nodeModules, ...this.nodeModules };
  }
}

module.exports = Dependencies;
