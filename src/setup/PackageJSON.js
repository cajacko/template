// @flow

import { orderObj } from '@cajacko/template-utils';
import merge from 'lodash/merge';
import { readJSON, pathExists } from 'fs-extra';
import SetupTemplate from '../modules/SetupTemplate';

const projectJSON = {
  name: 'weewee',
  version: '0.1.0',
  description: 'Example project',
  license: 'MIT',
  scripts: {
    start: 'template start',
    init: 'template init',
    test: 'template test',
    build: 'template build',
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

class PackageJSON extends SetupTemplate {
  constructor(...args) {
    super(...args);

    this.packageJSON = {};
  }

  preRun() {
    const path = this.fs.getDestPath('package.json');

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
    if (this.projectConfig) {
      const {
        slug, description, license, templates,
      } = this.projectConfig;
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

    return this.fs.writeJSON(
      orderObj(this.packageJSON, packageJSONOrder, endPriority),
      'package.json',
    );
  }
}

export default PackageJSON;
