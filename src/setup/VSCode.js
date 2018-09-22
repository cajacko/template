// @flow

import SetupTemplate from '../modules/SetupTemplate';
import { MAX_LINE_LENGTH } from '../config/general';

/**
 * Setup vscode for the project
 */
class VSCode extends SetupTemplate {
  /**
   * Set the default values for the vscode settings
   *
   * @param  {...any} args All constructor args
   *
   * @return {Void} No return value
   */
  constructor(...args) {
    super(...args);

    this.settings = {
      'editor.rulers': [MAX_LINE_LENGTH],
      'editor.tabSize': 2,
      'files.eol': '\n',
      'files.insertFinalNewline': true,
      'files.trimTrailingWhitespace': true,
      'prettier.eslintIntegration': true,
      'prettier.printWidth': MAX_LINE_LENGTH,
      'prettier.singleQuote': true,
      'eslint.packageManager': 'yarn',
      'npm.packageManager': 'yarn',
    };

    this.launch = {
      version: '0.2.0',
      configurations: [],
    };
  }

  /**
   * After setupFiles has run, commit the vscode files. This allows time for
   * other setup templates to define what goes in them
   *
   * @return {Void} No return value
   */
  postSetupFiles() {
    const promises = [];

    promises.push(this.fs.writeJSON(this.settings, '.vscode/settings.json'));
    promises.push(this.fs.writeJSON(this.launch, '.vscode/launch.json'));

    return Promise.all(promises);
  }
}

export default VSCode;
