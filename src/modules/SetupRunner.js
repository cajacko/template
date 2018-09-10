// @flow

import {
  StepRunner,
  QueuedFileManagement,
  QueuedNPMManager,
} from '@cajacko/template-utils';
import { join } from 'path';
import setupTemplates from '../setup';

class SetupRunner extends StepRunner {
  constructor(projectDir, projectConfig, lastTemplateVersion, lastLibVersion) {
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

    this.projectDir = projectDir;
    this.projectConfig = projectConfig;

    this.npm = new QueuedNPMManager(projectDir);

    const templateGitURL = `https://github.com/cajacko/template.git#${lastTemplateVersion}`;
    const libGitURL = `https://github.com/cajacko/lib.git#${lastLibVersion}`;

    this.npm.add({
      [templateGitURL]: { isGitURl: true },
      [libGitURL]: { isGitURl: true },
    });

    this.fs = new QueuedFileManagement(
      join(__dirname, '../../files'),
      projectDir,
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
        projectDir: this.projectDir,
      });

      this.addAllMatchingMethodsToSteps(setupTemplate);

      this[setupTemplateKey] = setupTemplate;
    });
  }
}

export default SetupRunner;
