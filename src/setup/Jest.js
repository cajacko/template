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
      collectCoverageFrom: ['src/**/*.js'],
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.js',
        '<rootDir>/features/**/*.test.js',
      ],
      testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/tmp'],
      modulePathIgnorePatterns: ['<rootDir>/tmp'],
    };

    this.runner.vscode.launch.configurations.push({
      type: 'node',
      name: 'vscode-jest-tests',
      request: 'launch',
      args: ['src', '--runInBand', '--coverage'],
      // eslint-disable-next-line no-template-curly-in-string
      cwd: '${workspaceFolder}',
      console: 'integratedTerminal',
      internalConsoleOptions: 'neverOpen',
      // eslint-disable-next-line no-template-curly-in-string
      program: '${workspaceFolder}/node_modules/jest/bin/jest',
    });

    this.runner.vscode.launch.configurations.push({
      type: 'node',
      name: 'vscode-jest-tests',
      request: 'launch',
      args: ['features', '--runInBand'],
      // eslint-disable-next-line no-template-curly-in-string
      cwd: '${workspaceFolder}',
      console: 'integratedTerminal',
      internalConsoleOptions: 'neverOpen',
      // eslint-disable-next-line no-template-curly-in-string
      program: '${workspaceFolder}/node_modules/jest/bin/jest',
    });

    return Promise.all(promises);
  }
}

export default Jest;
