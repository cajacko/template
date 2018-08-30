// @flow

import {
  StepRunner,
  QueuedFileManagement,
  QueuedNPMManager,
} from '@cajacko/template-utils';
import setupTemplates from '../setup';

class Setup extends StepRunner {
  constructor() {
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

    this.npm = new QueuedNPMManager();
    this.fs = new QueuedFileManagement();

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
      const setupTemplate = new SetupTemplate(this);

      this.addAllMatchingMethodsToSteps(setupTemplate);

      this[setupTemplateKey] = setupTemplate;
    });
  }
}

export default Setup;
