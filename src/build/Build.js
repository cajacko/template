const ScriptUtils = require('../utils/ScriptUtils');

class Build extends ScriptUtils {
  constructor(...config) {
    super(...config);

    this.buildTemplate = this.buildTemplate.bind(this);
  }

  buildTemplate({ config, key }) {
    const templateDir = this.getTemplateClass(key, config);

    return this.prepareTemplateDir(templateDir).then(() =>
      templateDir.build(key));
  }
}

module.exports = Build;
