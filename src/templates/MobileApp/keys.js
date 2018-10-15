// @flow

import {
  runCommand,
  CertStorage,
  ask,
  replaceInFile,
} from '@cajacko/template-utils';
import { join } from 'path';
import { remove, writeFile } from 'fs-extra';

/**
 * Get the android keys from cert storage
 *
 * @param {CertStorage} certStorage The cert storage instance
 *
 * @return {Promise} resolves with the keys
 */
const getAndroidKeys = (certStorage: CertStorage) => certStorage.get();

/**
 * Generate the Android keystore file
 *
 * @param {String} keyStorePath The path to write the keystor to
 * @param {String} keyStorePassword The keystore password to set
 * @param {String} alias The keystore alias
 * @param {String} bundleID The app bundle ID
 *
 * @return {Promise} Resolves when the keystore has been generated
 */
const generateAndroidKeys = (
  keyStorePath: string,
  keyStorePassword: string,
  alias: string,
  bundleID: string
) =>
  runCommand(`keytool -genkey -v -storepass ${keyStorePassword} -keypass ${keyStorePassword} -keystore ${keyStorePath} -alias ${alias} -keyalg RSA -keysize 2048 -validity 10000 -dname CN=${bundleID},OU=,O=,L=,S=,C=US`);

/**
 * Check if the android keys exist, if not create them. And put them in the
 * right places
 *
 * @param {CertStorage} certStorage The cert storage instance
 * @param {String} tmpDir The tmp dir where the certs will be applied
 * @param {String} bundleID The app bundle ID
 *
 * @return {Promise} Resolves when the Android keys are there
 */
export const ensureAndroidKeys = (
  certStorage: CertStorage,
  tmpDir: string,
  bundleID: string,
  { resetKeys }: { resetKeys: boolean }
) => {
  const keyStorePath = join(tmpDir, 'android/app/my-release-key.keystore');

  return remove(keyStorePath)
    .then(() => (resetKeys ? null : getAndroidKeys(certStorage)))
    .then((keys) => {
      if (keys) return keys;

      const alias = 'my-key-alias';

      return ask({
        type: 'password',
        message: 'Enter a password for the Android KeyStore',
        validate: (password) => {
          if (!password || password.length < 6) {
            return 'Key password must be at least 6 characters';
          }

          return true;
        },
      }).then(keyStorePassword =>
        generateAndroidKeys(keyStorePath, keyStorePassword, alias, bundleID)
          .then(() =>
            certStorage.add(
              {
                title: 'Android Keystore File',
                key: 'keystore',
                filePath: keyStorePath,
              },
              {
                title: 'Android Keystore Password',
                key: 'keystore-password',
                value: keyStorePassword,
              },
              {
                title: 'Android Keystore Alias',
                key: 'keystore-alias',
                value: alias,
              }
            ))
          .then(certStorage.commit)
          .then(() => getAndroidKeys(certStorage)));
    })
    .then((data) => {
      if (!data) throw new Error('Could not set the android keys');

      return Promise.all([
        writeFile(keyStorePath, data.keystore),
        replaceInFile(
          join(tmpDir, 'android/gradle.properties'),
          {
            regex: /=TEMPLATE_RELEASE_STORE_PASSWORD/,
            replacement: `=${data['keystore-password']}`,
          },
          {
            regex: /=TEMPLATE_RELEASE_KEY_PASSWORD/,
            replacement: `=${data['keystore-password']}`,
          },
          {
            regex: /=TEMPLATE_RELEASE_KEY_ALIAS/,
            replacement: `=${data['keystore-alias']}`,
          }
        ),
      ]);
    });
};

/**
 * Stub for when we do this
 *
 * @return {Promise} Resolves when the ios keys are there
 */
export const ensureIOSKeys = () => Promise.resolve();

/**
 * Ensure all the signing keys and auth exist for the specified platforms
 * (defaults to all platforms)
 *
 * @param {Object} opts Object specifying which platforms to ensure keys for
 *
 * @return {Promise} Resolves when the keys have been ensured for the specified
 * platforms
 */
export const ensureAppKeys = ({
  ios,
  android,
  certStorage,
  tmpDir,
  resetKeys,
  bundleID,
}: {
  ios?: boolean,
  android?: boolean,
  certStorage: CertStorage,
  tmpDir: string,
  resetKeys: boolean,
  bundleID: string,
}) => {
  const promises = [];

  const addAndroid = !promises.length || android;
  const addIOS = !promises.length || ios;

  if (addIOS) promises.push(() => ensureIOSKeys());
  if (addAndroid) {
    promises.push(() =>
      ensureAndroidKeys(certStorage, tmpDir, bundleID, { resetKeys }));
  }

  /**
   * Loop through each promise
   *
   * @param {Number} [i] The index in the loop to process
   *
   * @return {Promise} Resolves when the loop is finished
   */
  const loop = (i = 0) => {
    const promise = promises[i];

    if (!promise) return Promise.resolve();

    return promise().then(() => loop(i + 1));
  };

  return loop();
};
