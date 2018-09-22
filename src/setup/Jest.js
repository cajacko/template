// @flow

import SetupTemplate from '../modules/SetupTemplate';

/**
 * Add jest to the project
 */
class Jest extends SetupTemplate {
  /**
   * During the setup files stage add the jest dependency
   *
   * @return {Void} No return value
   */
  setupFiles() {
    const promises = [];

    promises.push(this.npm.add({
      jest: { type: 'dev', version: '23.6.0' },
    }));

    this.runner.packagejson.packageJSON.jest = {
      collectCoverage: true,
      collectCoverageFrom: ['src/**/*.js'],
      testMatch: ['<rootDir>/src/**/__tests__/**/*.js'],
      testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/tmp'],
      modulePathIgnorePatterns: ['<rootDir>/tmp'],
    };

    return Promise.all(promises);
  }
}

export default Jest;
