// @flow

import { join } from 'path';
import { ensureDir, copy, readJSON, writeJSON } from 'fs-extra';
import {
  runCommand,
  copyTmpl,
  copyDependencies,
  ask,
} from '@cajacko/template-utils';
import Template from '../modules/Template';
import { registerLibOutDir, setOutDirIsReady } from '../utils/libOutDirs';
import copyAndWatch from '../utils/copyAndWatch';
import { MOBILE_APP } from '../config/requiredEnv';

class MobileApp extends Template {
  constructor(...args) {
    super(...args);

    this.tmplDir = join(this.filesDir, 'mobile');
    this.tmplSrcDir = join(this.tmplDir, 'src');
    this.libOutDir = join(this.tmpDir, 'node_modules/@cajacko/lib');

    this.deployExpo = this.deployExpo.bind(this);
    this.deployToLocal = this.deployToLocal.bind(this);

    this.deployFuncs = {
      'dev-expo': this.deployExpo,
      'dev-local': this.deployToLocal,
      'alpha-deploygate': this.deployExpo,
      beta: this.deployExpo,
      live: this.deployExpo,
    };
  }

  init() {
    this.runIfUseLocal(() =>
      registerLibOutDir(this.libOutDir, this.shouldWatch));
  }

  setAppJSON() {
    const splashIconPath = this.templateConfig.splashIcon;
    const expoName = this.templateConfig.name || this.projectConfig.title;
    const expoSlug = this.templateConfig.slug || this.projectConfig.slug;

    if (!splashIconPath) return Promise.resolve();

    const appJSONPath = join(this.tmpDir, 'app.json');

    return readJSON(appJSONPath).then((contents) => {
      const appJSON = Object.assign({}, contents);

      appJSON.expo.splash.image = `./${splashIconPath}`;
      appJSON.expo.name = expoName;
      appJSON.expo.slug = expoSlug;
      appJSON.expo.icon = `./${this.templateConfig.icon}`;
      appJSON.expo.version = this.projectConfig.version;

      if (!appJSON.expo.ios) appJSON.expo.ios = {};
      if (!appJSON.expo.android) appJSON.expo.android = {};

      appJSON.expo.ios.bundleIdentifier = this.env.BUNDLE_ID;
      appJSON.expo.android.package = this.env.BUNDLE_ID;

      return writeJSON(appJSONPath, appJSON, { spaces: 2 });
    });
  }

  copyOrWatchSrc() {
    const tmpSrc = join(this.tmpDir, 'src');

    if (this.shouldWatch) {
      return copyAndWatch(this.projectSrcDir, tmpSrc, { exitOnError: true });
    }

    return copy(this.projectSrcDir, tmpSrc);
  }

  prepare() {
    return Promise.all([
      this.getActiveLibDir(),
      ensureDir(this.tmpDir)
        .then(() => copy(this.tmplSrcDir, this.tmpDir))
        .then(() =>
          copyDependencies(this.projectDir, this.tmpDir, {
            ignore: ['@cajacko/template'],
          })),
    ]).then(([localLibPath]) =>
      copyDependencies(localLibPath, this.tmpDir, {
        ignore: ['@cajacko/template'],
      }).then(() =>
        Promise.all([
          this.installDependencies().then(() =>
            this.runIfUseLocal(() => setOutDirIsReady(this.libOutDir))),
          this.copyOrWatchSrc(),
          copyTmpl(
            join(this.tmplDir, 'config.js'),
            join(this.tmpDir, 'config.js'),
            this.templateConfig,
          ),
          this.setAppJSON(),
        ])));
  }

  prompt() {
    return ask({
      type: 'list',
      choices: Object.keys(this.deployFuncs),
    });
  }

  prepareAndRun(...commands) {
    let i = 0;

    const runCommands = () => {
      const command = commands[i];
      i += 1;

      if (!command) return Promise.resolve();

      return runCommand(command, this.tmpDir).then(() => runCommands());
    };

    return this.prepare().then(runCommands);
  }

  deploy() {
    Object.keys(MOBILE_APP).forEach((envKey) => {
      if (!this.env[envKey]) {
        throw new Error(`${envKey} must be set in env`);
      }
    });

    return this.prompt().then(deploy => this.deployFuncs[deploy]());
  }

  deployExpo() {
    const { EXPO_USERNAME, EXPO_PASSWORD } = this.env;

    return this.prepareAndRun(
      'yarn exp logout',
      `yarn exp login -u ${EXPO_USERNAME} -p ${EXPO_PASSWORD}`,
      'yarn exp publish --non-interactive',
    );
  }

  deployToLocal() {
    return this.prepareAndRun('yarn run expo build:android');
  }

  start() {
    return this.prepareAndRun('yarn run start');
  }
}

export default MobileApp;
