const ScriptUtils = require('../utils/ScriptUtils');

class Start extends ScriptUtils {
  constructor(...config) {
    super(...config);
    this.shouldWatchTemplateDir = true;

    this.startTemplate = this.startTemplate.bind(this);
  }

  startTemplate({ config, key }) {
    const templateDir = this.getTemplateClass(key, config);

    return this.prepareTemplateDir(templateDir)
      .then(() => {
        templateDir.watchSrcFiles
          ? templateDir.watchSrcFiles()
          : templateDir._watchSrcFiles();

        if (this.shouldWatchTemplateDir) templateDir.watchTemplateFiles();
      })
      .then(() =>
        (templateDir.postWatch ? templateDir.postWatch() : Promise.resolve()))
      .then(templateDir.start);
  }
}

module.exports = Start;
