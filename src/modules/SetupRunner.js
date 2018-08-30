// @flow

import {
  StepRunner,
  QueuedFileManagement,
  QueuedNPMManager,
} from '@cajacko/template-utils';
import { join } from 'path';
import setupTemplates from '../setup';

class SetupRunner extends StepRunner {
  constructor(destPath, projectConfig) {
    const steps = [
      'preRun',
      'preSetupFiles',
      'setupFiles',
      'postSetupFiles',
      'preWriteFiles',
      'writeFiles',
      'postWriteFiles',
      'preInstallDependencies',
      'installDependencies',
      'postInstallDependencies',
      'postRun',
    ];

    super(steps);

    this.projectConfig = projectConfig;

    this.npm = new QueuedNPMManager(destPath);

    this.fs = new QueuedFileManagement(
      join(__dirname, '../../files'),
      destPath,
    );

    this.addInitialSteps();
    this.init();
  }

  addInitialSteps() {
    this.addToStep('writeFiles', this.fs.write);
    this.addToStep('installDependencies', this.npm.install);
  }

  init() {
    Object.keys(setupTemplates).forEach((setupTemplateKey) => {
      const SetupTemplate = setupTemplates[setupTemplateKey];
      const setupTemplate = new SetupTemplate(this, {
        projectConfig: this.projectConfig,
      });

      this.addAllMatchingMethodsToSteps(setupTemplate);

      this[setupTemplateKey] = setupTemplate;
    });
  }
}

export default SetupRunner;
