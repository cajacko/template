// @flow

import SetupTemplate from '../modules/SetupTemplate';

/**
 * Setup the docker files
 */
class Docker extends SetupTemplate {
  /**
   * During the setup files stage, copy the docker ignore file
   *
   * @return {Promise} Resolves when setting up the files has finished
   */
  setupFiles() {
    if (this.templatesUsed.includes('mobile-app')) {
      return Promise.all([
        this.fs.copy('.dockerignore'),
        this.fs.copy('deployAndroid.sh', 'scripts/deployAndroid.sh'),
      ]);
    }

    return Promise.resolve();
  }
}

export default Docker;
