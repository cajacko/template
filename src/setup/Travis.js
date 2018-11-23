// @flow

import SetupTemplate from '../modules/SetupTemplate';

/**
 * Setup the travis file
 */
class Travis extends SetupTemplate {
  /**
   * During the setup files stage, copy the travis file
   *
   * @return {Promise} Resolves when setting up the files has finished
   */
  setupFiles() {
    if (this.templatesUsed.includes('mobile-app')) {
      return this.fs.copy('.travis.yml');
    }

    return Promise.resolve();
  }
}

export default Travis;
