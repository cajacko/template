const ScriptUtils = require('../utils/ScriptUtils');

class Test extends ScriptUtils {
  constructor(...config) {
    super(...config);

    this.testTemplate = this.testTemplate.bind(this);
  }

  testTemplate({ config, key }) {
    const templateDir = this.getTemplateClass(key, config);

    return this.prepareTemplateDir(templateDir).then(templateDir.test);
  }
}

module.exports = Test;
