const Utils = require('../utils/Utils');
const globals = require('../utils/globals');

class Start extends Utils {
  constructor(...config) {
    super();

    this.config = config;
    this.shouldWatchTemplateDir = true;

    this.startTemplate = this.startTemplate.bind(this);
  }

  getTemplateToStart() {
    return this.getProjectConfig().then(config => ({
      config: config.templates['main-site'],
      key: 'main-site',
    }));
  }

  startTemplate({ config, key }) {
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

    const templateDir = new TemplateClass(key, config);

    return templateDir
      .setup()
      .then(templateDir.copyTemplateFiles)
      .then(templateDir.copy || Promise.resolve)
      .then(templateDir.installDependencies || Promise.resolve)
      .then(templateDir.copySrcFiles)
      .then(() => {
        templateDir.run();

        templateDir.watchSrcFiles
          ? templateDir.watchSrcFiles()
          : templateDir._watchSrcFiles();

        if (this.shouldWatchTemplateDir) templateDir.watchTemplateFiles();
      });
  }
}

module.exports = Start;
