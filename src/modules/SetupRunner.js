// @flow

import {
  StepRunner,
  QueuedFileManagement,
  QueuedNPMManager,
} from '@cajacko/template-utils';
import { join } from 'path';
import setupTemplates from '../setup';
import selfConfig from '../../project.json';

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
    this.projectConfig = projectConfig || {};

    this.npm = new QueuedNPMManager(projectDir);

    this.isSelf = this.projectConfig.slug === selfConfig.slug;

    if (!this.isSelf && !this.projectConfig.ignoreTemplates) {
      const templateGitURL = `https://github.com/cajacko/template.git#${lastTemplateVersion}`;
      const libGitURL = `https://github.com/cajacko/lib.git#${lastLibVersion}`;

      this.npm.add({
        [templateGitURL]: { isGitURl: true },
        [libGitURL]: { isGitURl: true },
      });
    }

    this.npm.add({
      '@cajacko/commit': { version: '0.2.0' },
    });

    this.fs = new QueuedFileManagement(
      join(__dirname, '../../files'),
      projectDir
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

      const templatesUsed = this.projectConfig.templates
        ? Object.values(this.projectConfig.templates).map(({ type }) => type)
        : [];

      const setupTemplate = new SetupTemplate(this, {
        projectConfig: this.projectConfig,
        projectDir: this.projectDir,
        templatesUsed,
        isSelf: this.isSelf,
      });

      this.addAllMatchingMethodsToSteps(setupTemplate);

      this[setupTemplateKey] = setupTemplate;
    });
  }
}

export default SetupRunner;
