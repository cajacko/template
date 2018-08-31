// @flow

import templates from '../templates';

class TemplateRunner {
  constructor(commander, projectConfig, env, projectDir) {
    this.projectConfig = projectConfig;
    this.env = env;
    this.projectDir = projectDir;
  }

  getTemplatesAndRunCommandInEach(command) {
    return this.getTemplatesToRun().then(templateKeys =>
      this.runCommandInEachTemplate(templateKeys, command));
  }

  runCommandInEachTemplate(templateKeys, command) {
    const promises = [];

    templateKeys.forEach((templateKey) => {
      const templateConfig = this.projectConfig.templates[templateKey];

      templateConfig.key = templateKey;

      const Template = templates[templateConfig.type];

      if (!Template) {
        throw new Error(`No template is available for "${templateConfig.type}"`);
      }

      const template = new Template(
        templateConfig,
        this.projectConfig,
        this.env,
        this.projectDir,
      );

      if (template[command]) promises.push(template[command]());
    });

    return Promise.all(promises);
  }

  start() {
    return this.getTemplatesAndRunCommandInEach('start');
  }

  getTemplatesToRun() {
    return Promise.resolve(Object.keys(this.projectConfig.templates));
  }
}

export default TemplateRunner;
