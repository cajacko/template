// @flow

import { ask, CertStorage } from '@cajacko/template-utils';
import type {
  Commander,
  ProjectConfig,
  Env,
} from '@cajacko/template-utils/lib/types';
import { join } from 'path';
import { remove } from 'fs-extra';
import templates from '../templates';
import type { Command, TemplateKeys } from '../types';

/**
 * Run and manage commands within each template
 */
class TemplateRunner {
  /**
   * Initialise the class by setting the props
   *
   * @param {Object} commander The commander object
   * @param {Object} projectConfig The project config
   * @param {Object} env The env variables
   * @param {String} projectDir The path to the proejct dir
   *
   * @return {Void} No return value
   */
  constructor(
    commander: Commander,
    projectConfig: ProjectConfig,
    env: Env,
    projectDir: string
  ) {
    this.projectConfig = projectConfig;
    this.env = env;
    this.projectDir = projectDir;
    this.commander = commander;

    if (!projectConfig.slug) {
      throw new Error('Cannot create cert storage. No project slug defined');
    }

    this.certStorage = new CertStorage(
      projectConfig.slug,
      `https://${this.env.GITHUB_TOKEN}@github.com/cajacko/${
        projectConfig.slug
      }-certificates.git`,
      null,
      { preventDelete: true }
    );
  }

  certStorage: CertStorage;
  commander: Commander;
  projectConfig: ProjectConfig;
  env: Env;
  projectDir: string;

  /**
   * Entry command for the class, will run the specified command
   *
   * @param {String} command The command to run
   *
   * @return {Promise} Promise that resolves when the command has been run
   */
  runCommand(command: Command) {
    return this.getTemplatesToRun().then((templateKeys: TemplateKeys) =>
      this.conditionalResetAndRun(command, templateKeys));
  }

  /**
   * Figure out which templates the command should be run in. Will get a
   * specified template if passed, will run all by default, or will ask if the
   * interactive flag is passed
   *
   * @return {Promise} Promise that resolves with the templates to run
   */
  getTemplatesToRun(): Promise<TemplateKeys> {
    const { template } = this.commander;

    if (template) return Promise.resolve([template]);

    const { projectConfig } = this;

    if (!projectConfig || !projectConfig.templates) {
      throw new Error('Could not get any templates from the project config');
    }

    const templateKeys: TemplateKeys = Object.keys(projectConfig.templates);

    if (!this.commander.interactive) {
      return Promise.resolve(templateKeys);
    }

    return ask({
      type: 'checkbox',
      choices: templateKeys,
      validate: (answers) => {
        if (answers.length < 1) {
          return 'You must select at least 1 template, use the spacebar to select';
        }

        return true;
      },
    });
  }

  /**
   * Run the command in each desired template, but may run reset before if
   * passed
   *
   * @param {String} command Command to run after the reset
   * @param {Array} templateKeys Array of template keys to run
   *
   * @return {Promise} Promise that resolves when the command has been run
   */
  conditionalResetAndRun(command: Command, templateKeys: TemplateKeys) {
    if (this.commander.reset) {
      return this.reset(templateKeys).then(() =>
        this.runCommandInEachTemplate(templateKeys, command));
    }

    return this.runCommandInEachTemplate(templateKeys, command);
  }

  /**
   * Reset the templates before carrying on
   *
   * @param {Array} templateKeys The template keys to reset
   *
   * @return {Promise} Promise that resolves when the reset is complete
   */
  reset(templateKeys: TemplateKeys) {
    return Promise.all([
      this.runCommandInEachTemplate(templateKeys, 'reset'),
      remove(join(this.projectDir, 'tmp')),
    ]);
  }

  /**
   * Run a command in each specified template
   *
   * @param {Array} templateKeys Array of template keys to run a command in
   * @param {String} command The command to run in each
   *
   * @return {Promise} Promise that resolves when the command has been run in
   * each template
   */
  runCommandInEachTemplate(templateKeys: TemplateKeys, command: Command) {
    const promises = [];

    templateKeys.forEach((templateKey) => {
      const templateConfig = this.projectConfig.templates[templateKey];

      templateConfig.key = templateKey;

      const Template = templates[templateConfig.type];

      if (!Template) {
        throw new Error(`No template is available for "${templateConfig.type}"`);
      }

      const certStorage = this.certStorage.registerSub(templateKey);

      const template = new Template(
        templateConfig,
        this.projectConfig,
        this.commander,
        this.env,
        this.projectDir,
        command,
        certStorage
      );

      if (template[command]) {
        let promise = Promise.resolve();

        if (template.init) {
          promise = promise.then(() => template.init());
        }

        promise = promise.then(() => template[command]());

        promises.push(promise);
      } else if (template.noCommand) {
        promises.push(template.noCommand());
      }
    });

    return Promise.all(promises);
  }
}

export default TemplateRunner;
