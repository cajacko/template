const { StartTemplate } = require('@cajacko/template');
const {
  copy, ensureDir, remove, readJSON, writeJSON,
} = require('fs-extra');
const { join } = require('path');

// @cajacko/template

class Utils {
  constructor() {
    this.fs = {
      // TODO:
      // ensureDir,
      // remove
      copyDirsAndWatch: this._copyDirsAndWatch,
      copyDirs: this._copyDirs,
      watch: this._watch,
    };
  }

  _whilePromises(array, callback) {
    const loop = (i = 0) => {
      const current = array[i];

      if (!current) return Promise.resolve();

      const next = () => loop(i + 1);

      return Promise.resolve(callback(current, i)).then(next);
    };

    return loop();
  }

  // _symLink(input, outputs) {

  // }

  _copyDirs(inputs, outputs, options) {
    // TODO:
    // options includes transforms to manipulate individual files that match
  }

  _watch(inputs, outputs, options) {
    // TODO:
    // options includes transforms to manipulate individual files that match
  }

  _copyDirAndWatch(inputs, outputs, options = {}) {
    return this.fs.copyDirs(inputs, outputs, options).then(() => {
      this.fs.watch(inputs, outputs, options);
    });
  }
}

class BindProject extends Utils {
  constructor(projectDir, projectConfig) {
    super();

    this.projectDir = projectDir;
    this.projectConfig = projectConfig;
    this.projectSrcDir = join(projectDir, projectConfig.srcDir || 'src');
    this.projectTmpDir = join(projectDir, 'tmp');
  }
}

class BindCommands extends BindProject {
  constructor(command = null, commandOptions = {}, ...args) {
    super(...args);

    this.command = command;
    this.commandOptions = commandOptions;
  }
}

class RunnerBase extends BindCommands {
  selectTemplates() {
    let selectedTemplates;

    if (this.commandOptions.selectTemplates) {
      // TODO: Prompt to select templates
      selectedTemplates = Promise.resolve();
    } else {
      const selected = [];

      Object.keys(this.projectConfig.templates).forEach((templateKey) => {
        selected.push(templateKey);
      });

      selectedTemplates = Promise.resolve(selected);
    }

    return selectedTemplates;
  }

  ensureProjectSetup() {
    // TODO:
    // unless --ignore-ensure-setup is passed
  }
}

class TemplateBase extends BindCommands {
  constructor(templateKey, templateConfig, ...args) {
    super(...args);

    this.templateKey = templateKey;
    this.templateConfig = templateConfig;
    this.templateTmpDir = join(this.projectTmpDir, this.templateKey);
  }

  ensureTemplateTmpDir() {
    return this.fs.ensureDir(this.templateTmpDir);
  }

  cleanTemplateTmpDir() {
    return this.fs.remove(this.templateTmpDir);
  }
}

class SetupBase extends BindProject {}

// @cajacko/lib

class LibTemplateBase extends TemplateBase {
  constructor(...args) {
    super(...args);
  }

  prepareTemplateTmpDir() {
    const clean = this.commandOptions.clean
      ? this.cleanTemplateTmpDir()
      : Promise.resolve();

    return clean.then(this.ensureTemplateTmpDir);
  }

  copyAndWatchTemplateSrc() {
    // TODO:
    return this.fs.copyDirsAndWatch();
  }

  copyAndWatchProjectSrc() {}
}

class Runner extends RunnerBase {
  constructor(...args) {
    super(...args);

    this.templates = {};

    this.templateTypes = {
      graphql: GraphQL,
    };

    const { templates } = this.projectConfig;

    Object.keys(templates).forEach((templateKey) => {
      const templateConfig = templates[templateKey];

      const Template = this.templates[templateConfig.type];

      this.templates[templateKey] = new Template(
        templateKey,
        templateConfig,
        ...args
      );
    });

    this.registerCommands();
    this.run();
  }

  registerCommands() {
    Object.keys(this.templates).forEach((template) => {
      if (template.registerCommands) {
        template.registerCommands();
      }
    });
  }

  run() {
    switch (this.command) {
      case 'start':
      case 'build':
        return this.runEachTemplate();
      default:
        return Promise.resolve();
    }
  }

  runEachTemplate(select = true) {
    return this.selectTemplates()
      .then((selectedTemplates) => {
        const templates = [];

        return this._whilePromises(selectedTemplates, (selectedTemplate) => {
          const template = this.templates[selectedTemplate];

          if (!template) return Promise.resolve();

          templates.push(template);

          if (!template.questions) return Promise.resolve();

          return template.questions();
        }).then(() => templates);
      })
      .then(templates =>
        this.ensureProjectSetup().then(() =>
          this._whilePromises(templates, template => template.init())));
  }
}

class GraphQL extends LibTemplateBase {
  constructor(...args) {
    super(...args);

    this.templateSrcDir = '';
  }

  init() {
    switch (this.command) {
      case 'start':
        return this.start();
      default:
        return Promise.resolve();
    }
  }

  registerCommands() {}

  questions() {
    // Switch on command and ask anything that need to
    return Promise.resolve();
  }

  start() {
    return this.prepareTemplateTmpDir().then(() => {
      const promises = [];

      promises.push(this.copyAndWatchTemplateSrc());
      promises.push(this.copyAndWatchProjectSrc());
    });

    /*
    Create tmp dir in projectDir as templateTmpDir
    Copy templateSrcDir to templateTmpDir and watch (transpile)
    Copy projectSrcDir to templateTmpSrcDir and watch (transpile)
    Copy templateSrcLinkFile to templateTmpDir/config.js (transpile, no watch)
    Start compiling templateLibDir to templateLibDistDir and copy to templateTmpDir/functions/node_modules/@cajacko/lib/dist
    Watch changes to dependencies in templateLibDir/package.json and install in templateTmpDir/functions
    Watch changes to dependencies in templateSrcDir/package.json and install in templateTmpDir
    Watch changes to dependencies in templateSrcDir/functions/package.json and install in templateTmpDir/functions
    Watch changes to dependencies in projectDir/package.json and install in templateTmpDir/functions
    */
  }
}

class EslintSetup extends SetupBase {}

/*
index.js
template/index.js
templates/GraphQL
templates/Mobile
templates/NPMModule
templates/Web
templates/Desktop
templates/files/mobile
templates/files/...
setup/index.js
setup/Eslint
setup/Jest
setup/...
setup/files/.editorconfig
setup/files/...
lib/...

*/

module.exports = GraphQL;
