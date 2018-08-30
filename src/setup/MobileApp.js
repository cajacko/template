const { StartTemplate } = require('@cajacko/template');
const {
  copy, ensureDir, remove, readJSON, writeJSON,
} = require('fs-extra');
const { join } = require('path');

class Website extends StartTemplate {
  constructor(...args) {
    super(...args);

    this.setTemplateSrc(join(__dirname, 'files/mobile/src'));
    this.setSrcDestination('src/projectFiles');

    this.installDependencies = this.installDependencies.bind(this);
    this.copy = this.copy.bind(this);
    this.start = this.start.bind(this);
    this.build = this.build.bind(this);
    this.test = this.test.bind(this);
  }

  copy() {
    const entryPath = this.config.entryFile;

    // TODO:
    // Copy dependencies from lib, and put inside the template dir

    return Promise.all([
      this.fs.copyTmpl(
        join(__dirname, 'files/mobile/nativeConfig.js'),
        join(this.tmpDir, 'src/config.js'),
        { entryPath }
      ),
      this.copySrcDependencies(),
    ]);
  }

  installDependencies() {
    return this.runCommand('yarn install', this.tmpDir);
  }

  start() {
    return this.runCommand('yarn start', this.tmpDir);
  }

  getLibBuildDir() {
    return join(this.tmpDir, 'node_modules/@cajacko/lib/dist');
  }

  buildLib() {
    const buildTo = this.getLibBuildDir();

    return this.runCommand(
      `yarn build:lib --${buildTo}`,
      join(__dirname, '../../')
    );
  }

  postWatch() {
    const buildTo = this.getLibBuildDir();

    this.runCommand(`yarn watch:lib --${buildTo}`, join(__dirname, '../../'));
  }

  postCopy() {
    // TODO:
    console.log('-- Copy flow, eslint, jsdocs to the tmp dir --');

    const promises = [];

    const { splashIcon, splashBackgroundColor } = this.config;

    if (splashIcon || splashBackgroundColor) {
      const appJSONPath = join(this.tmpDir, 'app.json');

      promises.push(readJSON(appJSONPath).then((appJSON) => {
        const newAppJSON = Object.assign({}, appJSON);

        if (splashIcon) {
          newAppJSON.expo.splash.image = `./src/projectFiles/${splashIcon}`;
        }

        if (splashBackgroundColor) {
          newAppJSON.expo.splash.backgroundColor = splashBackgroundColor;
        }

        return writeJSON(appJSONPath, newAppJSON, { spaces: 2 });
      }));
    }

    promises.push(this.buildLib());

    return Promise.all(promises);
  }

  cleanBuildDir(buildDir) {
    return ensureDir(buildDir).then(() => remove(buildDir));
  }

  build(key) {
    const buildDir = join(this.getDestPath(), 'build', key);

    return Promise.all([
      this.cleanBuildDir(buildDir),
      this.runCommand('yarn build', this.tmpDir),
    ]).then(() => copy(join(this.tmpDir, 'build'), buildDir));
  }

  test() {
    return this.runCommand('yarn test', this.tmpDir);
  }
}

module.exports = Website;
