// @flow

import { ask, CertStorage } from '@cajacko/template-utils';
import type { Env } from '@cajacko/template-utils/lib/types';
import { MOBILE_APP } from '../../config/requiredEnv';
import { ensureAppKeys } from './keys';

/**
 * Ask the user for an env to deploy to
 *
 * @param {Object} deployFuncs The different envs to deploy to
 *
 * @return {Promise} Resolves with the key of the deploy func to run
 */
const getDeployEnv = deployFuncs =>
  ask({
    type: 'list',
    choices: Object.keys(deployFuncs),
  });

/**
 * Deploy to DeployGate
 *
 * @return {Promise} Resolves when deployed successfully
 */
const deployDeployGate = () => {
  throw new Error('deployDeployGate');
  // return this.prepareAndRun(
  //   'yarn exp logout',
  //   `yarn exp login -u ${EXPO_USERNAME} -p ${EXPO_PASSWORD}`,
  //   'yarn exp publish --non-interactive'
  // );
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
}: {
  ios: boolean,
  android: boolean,
  env: Env,
  certStorage: CertStorage,
  tmpDir: string,
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
    ios, android, certStorage, tmpDir,
  }).then(() =>
    getDeployEnv(deployFuncs).then(deployFunc => deployFuncs[deployFunc]()));
};

export default deploy;
