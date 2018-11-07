// @flow

import { join } from 'path';
import { ensureDir, copy, readJSON, writeJSON } from 'fs-extra';
import Color from 'color';
import {
  runCommand,
  copyTmpl,
  copyDependencies,
  ask,
  replaceInFile,
  resizeImageAndCopyTo,
} from '@cajacko/template-utils';
import replace from 'replace';
import { execSync } from 'child_process';
import Template from '../../modules/Template';
import { registerLibOutDir, setOutDirIsReady } from '../../utils/libOutDirs';
import copyAndWatch from '../../utils/copyAndWatch';
import type { MobileAppTemplateConfig } from '../../types';
import deploy from './deploy';

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
  constructor(...args: *) {
    super(...args);

    this.ios = !!this.commander.ios;
    this.android = !!this.commander.android;

    this.tmplDir = join(this.filesDir, 'mobile');
    this.tmplSrcDir = join(this.tmplDir, 'src');
    this.libOutDir = join(this.tmpDir, 'node_modules/@cajacko/lib');

    (this: any).prepareApp = this.prepareApp.bind(this);
    (this: any).setPackageJSON = this.setPackageJSON.bind(this);

    this.name = this.templateConfig.name || this.projectConfig.title;
    this.displayName =
      this.templateConfig.displayName || this.projectConfig.title || this.name;
  }

  name: string;
  displayName: string;
  tmplDir: string;
  tmplSrcDir: string;
  libOutDir: string;
  templateConfig: MobileAppTemplateConfig;
  ios: boolean;
  android: boolean;

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
   * Set the app icon for all the different sizes
   *
   * @return {Promise} Resolves when the images have been set
   */
  setIcon() {
    const { icon } = this.templateConfig;

    if (!icon) {
      throw new Error('No splashIcon set in template config');
    }

    /**
     * Helper to get the height, width and path for the resized images
     *
     * @param {String} name The file name to set
     * @param {Number} size The height and width to set
     *
     * @return {Object} The config for the resize
     */
    const getIOSImageConfig = (name, size) => ({
      width: size,
      height: size,
      outPath: join(
        this.tmpDir,
        'ios/template/Images.xcassets/AppIcon.appiconset',
        `${name}.png`
      ),
    });

    /**
     * Helper to get the height, width and path for the resized images
     *
     * @param {String} name The file name to set
     * @param {Number} size The height and width to set
     * @param {Boolean} [isRound] Is the image the round version
     *
     * @return {Object} The config for the resize
     */
    const getAndroidImageConfig = (name, size, isRound) => ({
      width: size,
      height: size,
      outPath: join(
        this.tmpDir,
        'android/app/src/main/res',
        name,
        isRound ? 'ic_launcher.png' : 'ic_launcher_round.png'
      ),
    });

    return Promise.all([
      resizeImageAndCopyTo(
        join(this.projectDir, icon),
        getIOSImageConfig('Icon-App-20x20@1x', 20),
        getIOSImageConfig('Icon-App-20x20@2x', 40),
        getIOSImageConfig('Icon-App-20x20@3x', 60),
        getIOSImageConfig('Icon-App-29x29@1x', 29),
        getIOSImageConfig('Icon-App-29x29@2x', 58),
        getIOSImageConfig('Icon-App-29x29@3x', 87),
        getIOSImageConfig('Icon-App-40x40@1x', 40),
        getIOSImageConfig('Icon-App-40x40@2x', 80),
        getIOSImageConfig('Icon-App-40x40@3x', 120),
        getIOSImageConfig('Icon-App-57x57@1x', 57),
        getIOSImageConfig('Icon-App-57x57@2x', 114),
        getIOSImageConfig('Icon-App-60x60@2x', 120),
        getIOSImageConfig('Icon-App-60x60@3x', 180),
        getIOSImageConfig('Icon-App-72x72@1x', 72),
        getIOSImageConfig('Icon-App-72x72@2x', 144),
        getIOSImageConfig('Icon-App-76x76@1x', 76),
        getIOSImageConfig('Icon-App-76x76@2x', 152),
        getIOSImageConfig('Icon-App-83.5x83.5@2x', 167),
        getIOSImageConfig('Icon-Small-50x50@1x', 50),
        getIOSImageConfig('Icon-Small-50x50@2x', 100),
        getIOSImageConfig('ItunesArtwork@2x', 1024)
      ),
      resizeImageAndCopyTo(
        join(this.projectDir, icon),
        getAndroidImageConfig('mipmap-hdpi', 72),
        getAndroidImageConfig('mipmap-mdpi', 48),
        getAndroidImageConfig('mipmap-xhdpi', 96),
        getAndroidImageConfig('mipmap-xxhdpi', 144),
        getAndroidImageConfig('mipmap-xxxhdpi', 192),
        getAndroidImageConfig('mipmap-hdpi', 72, true),
        getAndroidImageConfig('mipmap-mdpi', 48, true),
        getAndroidImageConfig('mipmap-xhdpi', 96, true),
        getAndroidImageConfig('mipmap-xxhdpi', 144, true),
        getAndroidImageConfig('mipmap-xxxhdpi', 192, true)
      ),
    ]);
  }

  /**
   * Set the splash screen
   *
   * @return {Promise} Resolves when the splash screen has been set
   */
  setSplash() {
    const promises = [];

    const { splashBackgroundColor, splashIcon } = this.templateConfig;

    if (splashBackgroundColor) {
      const color = Color(splashBackgroundColor);

      const [red, green, blue] = color
        .rgb()
        .array()
        .map(val => val / 255);

      promises.push(replaceInFile(
        join(this.tmpDir, 'ios/template/Base.lproj/LaunchScreen.xib'),
        { regex: 'TEMPLATE_RED', replacement: red },
        { regex: 'TEMPLATE_GREEN', replacement: green },
        { regex: 'TEMPLATE_BLUE', replacement: blue }
      ));
    } else {
      throw new Error('No splashBackgroundColor set in template config');
    }

    if (splashIcon) {
      /**
       * Helper to get the height, width and path for the resized images
       *
       * @param {String} name The file name to set
       * @param {Number} size The height and width to set
       *
       * @return {Object} The config for the resize
       */
      const getIOSImageConfig = (name, size) => ({
        width: size,
        height: size,
        outPath: join(
          this.tmpDir,
          'ios/template/Images.xcassets/SplashIcon.imageset',
          name
        ),
      });

      promises.push(resizeImageAndCopyTo(
        join(this.projectDir, splashIcon),
        getIOSImageConfig('icon.png', 200),
        getIOSImageConfig('icon@2x.png', 400),
        getIOSImageConfig('icon@3x.png', 600)
      ));
    } else {
      throw new Error('No splashIcon set in template config');
    }

    return Promise.all(promises);
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
  prepareApp() {
    if (this.commander.skipPrepare) return Promise.resolve();

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
      .then(this.setPackageJSON)
      .then(() =>
        Promise.all([
          this.installDependencies().then(() =>
            this.runIfUseLocal(() => setOutDirIsReady(this.libOutDir))),
          this.copyOrWatchSrc(),
          copyTmpl(
            join(this.tmplDir, 'config.js'),
            join(this.tmpDir, 'config.js'),
            this.templateConfig
          ),
          this.setAppJSON(),
          this.setSplash(),
          this.setIcon(),
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
  replace(regex: string, replacement: string) {
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
  prepareAndRun(...commands: Array<string>) {
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

    return this.prepareApp().then(runCommands);
  }

  /**
   * Deploy the app to the desired env
   *
   * @return {Promise} Resolves when the deploy has completed
   */
  deploy() {
    return this.prepareApp().then(() =>
      deploy({
        ios: this.ios,
        android: this.android,
        env: this.env,
        certStorage: this.certStorage,
        tmpDir: this.tmpDir,
        resetKeys: this.commander.resetKeys,
        bundleID: this.env.BUNDLE_ID,
        deployGateToken: this.env.DEPLOY_GATE_TOKEN,
        deployGateUser: this.env.DEPLOY_GATE_USER,
        skipBuild: this.commander.skipBuild,
        deployEnv: this.commander.deployEnv,
      }));
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
      runCommand('watchman watch-del-all'),
      runCommand('rm -rf /tmp/metro-bundler-cache-*'),
    ]);
  }

  /**
   * Start the mobile app
   *
   * @return {Promise} Resolves when the initial build has finished
   */
  start() {
    return this.resetPackager()
      .then(this.prepareApp)
      .then(() => {
        logger.debug('start');

        const promises = [runCommand('yarn run start', this.tmpDir)];

        if (!this.ios && !this.android) {
          throw new Error('You must specify ios and/or android');
        }

        if (this.ios) {
          logger.debug('ios build started');

          promises.push(runCommand('npx react-native run-ios', this.tmpDir, {
            noLog: true,
          }).then(() => {
            logger.debug('ios build finished');
          }));
        }

        if (this.android) {
          logger.debug('android build started');

          promises.push(runCommand('npx react-native run-android', this.tmpDir, {
            // noLog: true,
          }).then(() => {
            logger.debug('android build started');
          }));
        }

        return Promise.all(promises);
      })
      .then(() => {
        logger.debug('start finished');
      });
  }
}

export default MobileApp;
