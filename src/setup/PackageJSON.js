// @flow

import { orderObj } from '@cajacko/template-utils';
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
    prepare: 'template prepare',
  },
};

const packageJSONOrder = [
  'name',
  'version',
  'description',
  'bin',
  'scripts',
  'main',
  'license',
];

const endPriority = ['dependencies', 'devDependencies'];

class PackageJSON extends SetupTemplate {
  constructor(...args) {
    super(...args);

    this.packageJSON = {};
  }

  setupFiles() {
    this.packageJSON = projectJSON;

    if (this.isSelf) {
      Object.keys(this.packageJSON.scripts).forEach((key) => {
        const val = this.packageJSON.scripts[key];

        this.packageJSON.scripts[key] = val.replace(
          'template',
          'node dist/bin.js',
        );
      });
    }
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
          const {
            type, bin, files, main, dependencies,
          } = templates[template];

          if (type !== 'npm-module') return;

          if (main) this.packageJSON.main = main;

          if (!this.packageJSON.files) this.packageJSON.files = files || [];

          this.packageJSON.files.push('dist/**/*');

          if (bin) {
            Object.keys(bin).forEach((command) => {
              const path = bin[command];

              if (!this.packageJSON.bin) this.packageJSON.bin = {};

              this.packageJSON.bin[command] = path;
            });
          }

          if (dependencies) {
            Object.keys(dependencies).forEach((key) => {
              const version = dependencies[key];

              this.npm.add({
                [key]: { version },
              });
            });
          }
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
