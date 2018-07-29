const Utils = require('../utils/Utils');
const globals = require('../utils/globals');

class ScriptUtils extends Utils {
  constructor(...config) {
    super();

    this.config = config;
  }

  getTemplate() {
    return this.getProjectConfig().then(config => ({
      config: config.templates['main-app'],
      key: 'main-app',
    }));
  }

  getTemplateClass(key, config) {
    const templateClasses = globals.get('templateClasses');

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
