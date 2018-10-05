// @flow

import { join } from 'path';
import { ensureDir, copy, readJSON, writeJSON } from 'fs-extra';
import {
  runCommand,
  copyTmpl,
  copyDependencies,
  ask,
} from '@cajacko/template-utils';
import replace from 'replace';
import { execSync } from 'child_process';
import Template from '../modules/Template';
import { registerLibOutDir, setOutDirIsReady } from '../utils/libOutDirs';
import copyAndWatch from '../utils/copyAndWatch';
import { MOBILE_APP } from '../config/requiredEnv';

/**
 * Run commands for the mobile app template
 */
class MobileApp extends Template {
  /**
   * Setup the class, define some helper props
   *
   * @param  {...any} args Params to pass to base class
   *
   * @return {Void} No return value
   */
  constructor(...args) {
    super(...args);

    this.tmplDir = join(this.filesDir, 'mobile');
    this.tmplSrcDir = join(this.tmplDir, 'src');
    this.libOutDir = join(this.tmpDir, 'node_modules/@cajacko/lib');

    this.deployExpo = this.deployExpo.bind(this);
    this.deployToLocal = this.deployToLocal.bind(this);

    this.name = this.templateConfig.name || this.projectConfig.title;
    this.displayName =
      this.templateConfig.displayName || this.projectConfig.title || this.name;

    this.deployFuncs = {
      'dev-expo': this.deployExpo,
      'dev-local': this.deployToLocal,
      'alpha-deploygate': this.deployExpo,
      beta: this.deployExpo,
      live: this.deployExpo,
    };

    this.prepare = this.prepare.bind(this);
  }

  /**
   * When the class initialises, decide whether to register the lib dir or not
   *
   * @return {Void} No return value
   */
  init() {
    this.runIfUseLocal(() =>
      registerLibOutDir(this.libOutDir, this.shouldWatch));
  }

  /**
   * Set the app.json file
   *
   * @return {Promise} Promise that resolves when the file has been set
   */
  setAppJSON() {
    const appJSONPath = join(this.tmpDir, 'app.json');

    return readJSON(appJSONPath).then((contents) => {
      const appJSON = Object.assign({}, contents);

      appJSON.name = this.name;
      appJSON.displayName = this.displayName;

      return writeJSON(appJSONPath, appJSON, { spaces: 2 });
    });
  }

  /**
   * Set the required details in the package.json file
   *
   * @return {Promise} Promise that resolves when the file has been set
   */
  setPackageJSON() {
    const packageJSONPath = join(this.tmpDir, 'package.json');

    return readJSON(packageJSONPath).then((contents) => {
      const packageJSON = Object.assign({}, contents);

      packageJSON.name = this.name;

      return writeJSON(packageJSONPath, packageJSON, { spaces: 2 });
    });
  }

  /**
   * Copy the src file to tmp and watch if required
   *
   * @return {Promise} Promise that resolves when the copy has finished
   */
  copyOrWatchSrc() {
    const tmpSrc = join(this.tmpDir, 'src');

    if (this.shouldWatch) {
      return copyAndWatch(this.projectSrcDir, tmpSrc, { exitOnError: true });
    }

    return copy(this.projectSrcDir, tmpSrc);
  }

  /**
   * Prepare the mobile app. Copies all the required files into tmp and watches
   * anything that needs watching
   *
   * @return {Promise} Promise that resolves when the mobile app dir is ready
   */
  prepare() {
    logger.debug('MobileApp - prepare');

    return Promise.all([
      this.getActiveLibDir(),
      ensureDir(this.tmpDir).then(() =>
        copy(this.tmplSrcDir, this.tmpDir).then(() =>
          copyDependencies(this.projectDir, this.tmpDir, {
            ignore: ['@cajacko/template', '@cajacko/commit'],
          }))),
    ])
      .then(([localLibPath]) =>
        copyDependencies(localLibPath, this.tmpDir, {
          ignore: ['@cajacko/template', '@cajacko/commit'],
        }))
      .then(() =>
        Promise.all([
          this.installDependencies().then(() =>
            this.runIfUseLocal(() => setOutDirIsReady(this.libOutDir))),
          // this.runIfUseLocal(() => setOutDirIsReady(this.libOutDir)),
          this.copyOrWatchSrc(),
          copyTmpl(
            join(this.tmplDir, 'config.js'),
            join(this.tmpDir, 'config.js'),
            this.templateConfig
          ),
          this.setAppJSON(),
          this.setPackageJSON(),
        ]))
      .then(() => {
        this.replace('TEMPLATE_DISPLAY_NAME', this.displayName);
        this.replace('TEMPLATE-BUNDLE-ID', this.env.BUNDLE_ID);

        logger.debug('MobileApp - prepare finished');
      });
  }

  /**
   * Find and replace a regex inside the ios and android files
   *
   * @param {String} regex The regex to find
   * @param {String} replacement What to replace it with
   *
   * @return {Void} No return value (is sync func)
   */
  replace(regex, replacement) {
    replace({
      regex,
      replacement,
      paths: [join(this.tmpDir, 'ios'), join(this.tmpDir, 'android')],
      recursive: true,
      silent: true,
    });
  }

  /**
   * Ask what env to deploy to
   *
   * @return {Promise} Resolves with the env to deploy to
   */
  prompt() {
    return ask({
      type: 'list',
      choices: Object.keys(this.deployFuncs),
    });
  }

  /**
   * Prepare the tmp dir and then run each command passed as an arg
   *
   * @param  {...any} commands Each command to run in order
   *
   * @return {Promise} Promise that resolves when all the commands have been run
   */
  prepareAndRun(...commands) {
    let i = 0;

    /**
     * Loop through each command and run it
     *
     * @return {Promise} Promise that resolves when all commands have been run
     */
    const runCommands = () => {
      const command = commands[i];
      i += 1;

      if (!command) return Promise.resolve();

      return runCommand(command, this.tmpDir).then(() => runCommands());
    };

    return this.prepare().then(runCommands);
  }

  /**
   * Deploy the app to the desired env
   *
   * @return {Promise} Resolves when the deploy has completed
   */
  deploy() {
    Object.keys(MOBILE_APP).forEach((envKey) => {
      if (!this.env[envKey]) {
        throw new Error(`${envKey} must be set in env`);
      }
    });

    return this.prompt().then(deploy => this.deployFuncs[deploy]());
  }

  /**
   * Deploy to expo
   *
   * @return {Promise} Resolves when the deploy has completed
   */
  deployExpo() {
    const { EXPO_USERNAME, EXPO_PASSWORD } = this.env;

    return this.prepareAndRun(
      'yarn exp logout',
      `yarn exp login -u ${EXPO_USERNAME} -p ${EXPO_PASSWORD}`,
      'yarn exp publish --non-interactive'
    );
  }

  /**
   * Run the expo build
   *
   * @return {Promise} Resolves when the build has finished
   */
  expoBuild() {
    let onReadyToBuild;
    let onFinishedBuild;
    let finishedBuildingJSCount = 0;
    let kill;

    const readyToBuild = new Promise((resolve, reject) => {
      onReadyToBuild = () => {
        resolve();
      };

      setTimeout(() => {
        reject(new Error('Timed out waiting for expo packager to start'));
      }, 60 * 1000);
    });

    const postBuild = new Promise((resolve, reject) => {
      onFinishedBuild = () => {
        kill();
        resolve();
      };

      readyToBuild
        .then(() => {
          setTimeout(() => {
            kill();
            reject(new Error('Timed out waiting for expo build'));
          }, 5 * 60 * 1000);
        })
        .catch((e) => {
          kill();
          reject(e);
        });
    });

    runCommand('yarn run exp start', this.tmpDir, {
      getKill: (k) => {
        kill = k;
      },
      onData: (data) => {
        const string = String(data);

        if (string.includes('Expo is ready')) {
          onReadyToBuild();
        } else if (string.includes('Finished building JavaScript')) {
          finishedBuildingJSCount += 1;

          if (finishedBuildingJSCount === 3) {
            onFinishedBuild();
          }
        }
      },
    });

    return { readyToBuild, postBuild };
  }

  /**
   * Deploy to the local machine
   *
   * @return {Promise} Resolves when the deploy has completed
   */
  deployToLocal() {
    const { readyToBuild, postBuild } = this.expoBuild();

    return this.prepare()
      .then(() => readyToBuild)
      .then(() =>
        Promise.all([
          runCommand('yarn run expo build:android', this.tmpDir),
          postBuild,
        ]))
      .then(() => {
        // TODO: Grab the download url
      });
  }

  /**
   * Stop any existing metro process on port 8081
   *
   * @return {Promise} Resolves when the process has been reset
   */
  resetPackager() {
    execSync('lsof -ti:8081 | xargs kill');

    return Promise.resolve();
  }

  /**
   * Reset everything to do with running the mobile app
   *
   * @return {Promise} Promise that resolves when everything has been reset
   */
  reset() {
    return Promise.all([
      runCommand('watchman watch-del-all', this.tmpDir),
      runCommand('rm -rf /tmp/metro-bundler-cache-*', this.tmpDir),
    ]);
  }

  /**
   * Start the mobile app
   *
   * @return {Promise} Resolves when the initial build has finished
   */
  start() {
    return this.resetPackager()
      .then(this.prepare)
      .then(() => {
        logger.debug('start');

        return Promise.all([
          runCommand('yarn run start', this.tmpDir),
          runCommand('react-native run-ios', this.tmpDir, {
            noLog: true,
          }).then(() => {
            logger.debug('Build finished');
          }),
        ]);
      })
      .then(() => {
        logger.debug('start finished');
      });
  }
}

export default MobileApp;
