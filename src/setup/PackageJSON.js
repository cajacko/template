const { RunnerTemplate } = require('@cajacko/template');
const merge = require('lodash/merge');
const { readJSON, pathExists } = require('fs-extra');
const orderObj = require('../utils/orderObj');

const projectJSON = {
  name: 'weewee',
  version: '0.1.0',
  description: 'Example project',
  license: 'MIT',
  scripts: {
    start: 'template start',
    test: 'template test',
    deploy: 'template deploy',
    upgrade: 'template upgrade',
    postinstall: 'template postinstall',
    precommit: 'template precommit',
  },
};

const packageJSONOrder = [
  'name',
  'version',
  'description',
  'bin',
  'scripts',
  'license',
];

const endPriority = ['dependencies', 'devDependencies'];

class PackageJSON extends RunnerTemplate {
  constructor(...args) {
    super(...args);

    this.packageJSON = {};
  }

  preRun() {
    const path = this.getDestPath('package.json');

    return pathExists(path)
      .then((exists) => {
        if (!exists) return projectJSON;

        return readJSON(path).then(json => merge(projectJSON, json));
      })
      .then((json) => {
        this.packageJSON = json;
      });
  }

  setupFiles() {
    this.packageJSON = projectJSON;
  }

  postSetupFiles() {
    if (this.runner.projectConfig) {
      const {
        slug,
        description,
        license,
        templates,
      } = this.runner.projectConfig;
      this.packageJSON.name = slug;
      this.packageJSON.description = description;
      this.packageJSON.license = license;

      if (templates) {
        Object.keys(templates).forEach((template) => {
          const { type, bin } = templates[template];

          if (type !== 'npm-module' || !bin) return;

          Object.keys(bin).forEach((command) => {
            const path = bin[command];

            if (!this.packageJSON.bin) this.packageJSON.bin = {};

            this.packageJSON.bin[command] = path;
          });
        });
      }
    }

    return this.runner.writeJSON(
      orderObj(this.packageJSON, packageJSONOrder, endPriority),
      'package.json'
    );
  }
}

module.exports = PackageJSON;
