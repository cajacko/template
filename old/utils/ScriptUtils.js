const Utils = require('../utils/Utils');
const globals = require('../utils/globals');

class ScriptUtils extends Utils {
  constructor(...config) {
    super();

    this.config = config;
  }

  getTemplate() {
    return this.getProjectConfig().then((config) => {
      if (!config || !config.templates) {
        throw new Error('There is no config or templates defined in project.json');
      }

      const keys = Object.keys(config.templates);

      if (!keys.length) {
        throw new Error('There are no templates defined in project.json');
      }

      return this.prompt([
        {
          name: 'key',
          type: 'list',
          choices: keys,
        },
      ]).then(({ key }) => ({
        config: config.templates[key],
        key,
      }));
    });
  }

  getTemplateClass(key, config) {
    const templateClasses = globals.get('templateClasses');

    if (!config) {
      throw new Error('No config was passed to getTemplateClass');
    }

    if (!templateClasses) {
      throw new Error('No template classes have been set, you need to call setTemplateClasses');
    }

    if (!config.type) {
      throw new Error(`The "${key}" template does not have a type set`);
    }

    const TemplateClass = templateClasses[config.type];

    if (!TemplateClass) {
      throw new Error(`No template specified for "${config.type}"`);
    }

    return new TemplateClass(key, config);
  }

  installDependencies(templateDir) {
    return templateDir.installDependencies
      ? templateDir.installDependencies()
      : Promise.resolve();
  }

  prepareTemplateDir(templateDir) {
    return templateDir
      .setup()
      .then(templateDir.copyTemplateFiles)
      .then(() => (templateDir.copy ? templateDir.copy() : Promise.resolve()))
      .then(() =>
        (templateDir.postCopy ? templateDir.postCopy() : Promise.resolve()))
      .then(() => this.installDependencies(templateDir))
      .then(templateDir.copySrcFiles);
  }
}

module.exports = ScriptUtils;