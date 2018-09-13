// @flow

import { ask } from '@cajacko/template-utils';
import { join } from 'path';
import { remove } from 'fs-extra';
import templates from '../templates';

class TemplateRunner {
  constructor(commander, projectConfig, env, projectDir) {
    this.projectConfig = projectConfig;
    this.env = env;
    this.projectDir = projectDir;
    this.commander = commander;
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
        this.commander,
        this.env,
        this.projectDir,
        command,
      );

      if (template[command]) promises.push(template[command]());
    });

    return Promise.all(promises);
  }

  reset() {
    return remove(join(this.projectDir, 'tmp'));
  }

  conditionalResetAndRun(command) {
    if (this.commander.reset) {
      return this.reset().then(() =>
        this.getTemplatesAndRunCommandInEach(command));
    }

    return this.getTemplatesAndRunCommandInEach(command);
  }

  deploy() {
    return this.conditionalResetAndRun('deploy');
  }

  start() {
    return this.conditionalResetAndRun('start');
  }

  getTemplatesToRun() {
    const { template } = this.commander;

    if (template) return Promise.resolve([template]);

    const templateKeys = Object.keys(this.projectConfig.templates);

    if (!this.commander.interactive) {
      return Promise.resolve(templateKeys);
    }

    return ask({
      type: 'checkbox',
      choices: templateKeys,
      validate: (answers) => {
        if (answers.length < 1) return 'You must select at least 1 template, use the spacebar to select';

        return true;
      }
    });
  }
}

export default TemplateRunner;
