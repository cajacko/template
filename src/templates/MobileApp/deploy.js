// @flow

import { ask, CertStorage, runCommand } from '@cajacko/template-utils';
import type { Env } from '@cajacko/template-utils/lib/types';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import { MOBILE_APP } from '../../config/requiredEnv';
import { ensureAppKeys } from './keys';

/**
 * Build the Android release
 *
 * @param {String} tmpDir The tmp dir everything is built in
 * @param {Object} opts The options passed to the func
 *
 * @return {Promise} Resolves When the Android build has finished
 */
const androidReleaseBuild = (tmpDir: string, { skipBuild } = {}) => {
  /**
   * Build the app or skip
   *
   * @return {Promise} Resolves when the build has finished or skipped
   */
  const build = () => {
    if (skipBuild) return Promise.resolve();

    return runCommand('./gradlew assembleRelease', join(tmpDir, 'android'));
  };

  return build().then(() =>
    join(tmpDir, 'android/app/build/outputs/apk/release/app-release.apk'));
};

/**
 * Ask the user for an env to deploy to, or validate the passed in env
 *
 * @param {Object} deployFuncs The different envs to deploy to
 * @param {String} [deployEnv] The passed env to deploy to
 *
 * @return {Promise} Resolves with the key of the deploy func to run
 */
const getDeployEnv = (deployFuncs, deployEnv) => {
  if (deployEnv && deployFuncs[deployEnv]) return Promise.resolve(deployEnv);

  return ask({
    type: 'list',
    choices: Object.keys(deployFuncs),
  });
};

/**
 * Deploy to DeployGate
 *
 * @return {Promise} Resolves when deployed successfully
 */
const deployDeployGate = ({
  android,
  tmpDir,
  deployGateToken,
  deployGateUser,
  skipBuild,
}: {
  android: boolean,
  tmpDir: string,
  deployGateToken: string,
  deployGateUser: string,
  skipBuild: boolean,
}) => {
  /**
   * Build the app
   *
   * @return {Promise} Resolves when the app has been built
   */
  const buildApp = () => {
    if (android) {
      return androidReleaseBuild(tmpDir, { skipBuild });
    }

    throw new Error('deployDeployGate');
  };

  return buildApp()
    .then((appPath) => {
      const form = new FormData();
      form.append('token', deployGateToken);
      form.append('file', createReadStream(appPath));

      return fetch(`https://deploygate.com/api/users/${deployGateUser}/apps`, {
        method: 'POST',
        body: form,
      });
    })
    .then(res => res.json())
    .then(({ error, message }) => {
      if (error) {
        throw new Error(message || 'Undefined error from deploy gate');
      }
    });
};

/**
 * Deploy the application
 *
 * @param {Object} opts The options needed to run deploy (check flow)
 *
 * @return {Promise} Resolves when successfully deployed
 */
const deploy = ({
  ios,
  android,
  env,
  certStorage,
  tmpDir,
  resetKeys,
  bundleID,
  deployGateToken,
  deployGateUser,
  skipBuild,
  deployEnv,
}: {
  ios: boolean,
  android: boolean,
  env: Env,
  certStorage: CertStorage,
  tmpDir: string,
  resetKeys: boolean,
  bundleID: string,
  deployGateToken: string,
  deployGateUser: string,
  skipBuild: boolean,
  deployEnv?: ?string,
}) => {
  const deployFuncs = {
    // 'dev-expo': this.deployExpo,
    // 'dev-local': this.deployToLocal,
    'alpha-deploygate': deployDeployGate,
    beta: deployDeployGate,
    live: deployDeployGate,
  };

  if (!ios && !android) {
    throw new Error('You must specify ios and/or android');
  }

  Object.keys(MOBILE_APP).forEach((envKey) => {
    if (!env[envKey]) {
      throw new Error(`${envKey} must be set in env`);
    }
  });

  return ensureAppKeys({
    ios,
    android,
    certStorage,
    tmpDir,
    resetKeys,
    bundleID,
  }).then(() =>
    getDeployEnv(deployFuncs, deployEnv).then(deployFunc =>
      deployFuncs[deployFunc]({
        ios,
        android,
        tmpDir,
        deployGateToken,
        deployGateUser,
        skipBuild,
      })));
};

export default deploy;
