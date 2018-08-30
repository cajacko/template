// @flow

import templates from '../templates';

class TemplateRunner {
  constructor(commander, projectConfig) {
    this.projectConfig = projectConfig;
  }

  getTemplatesAndRunCommandInEach(command) {
    return this.getTemplatesToRun().then(templateKeys =>
      this.runCommandInEachTemplate(templateKeys, command));
  }

  runCommandInEachTemplate(templateKeys, command) {
    const promises = [];

    templateKeys.forEach((templateKey) => {
      const templateConfig = this.projectConfig.templates[templateKey];

      const Template = templates[templateConfig.type];

      const template = new Template();

      promises.push(template[command]());
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
