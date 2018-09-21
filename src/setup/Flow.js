// @flow

import SetupTemplate from '../modules/SetupTemplate';

/**
 * Setup flow for the project
 */
class Flow extends SetupTemplate {
  /**
   * During the setup files stage, add everything needed to run flow in the
   * project, and for the IDE's to run it
   *
   * @return {Void} No return value
   */
  setupFiles() {
    const promises = [];

    promises.push(this.fs.copy('.flowconfig'));

    promises.push(this.npm.add({
      'flow-bin': { type: 'dev', version: '0.81.0' },
    }));

    return Promise.all(promises);
  }
}

export default Flow;
