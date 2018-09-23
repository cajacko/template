// @flow

import { pathExists, readFile } from 'fs-extra';
import { join } from 'path';
import SetupTemplate from '../modules/SetupTemplate';

/**
 * Add the gitignore file to the project
 */
class GitIgnore extends SetupTemplate {
  /**
   * During the setup files stage add the default stuff to the gitignore file
   *
   * @return {Promise} Promise that resolves when the file has been added
   */
  setupFiles() {
    return this.getGitIgnoreIfExists().then((gitIgnore) => {
      const vars = { custom: '' };

      if (gitIgnore) {
        vars.custom = this.getCustomFromGitIgnore(gitIgnore);
      }

      return this.fs.copyTmpl('.gitignore', null, vars);
    });
  }

  /**
   * Get the existing .gitignore file if it exists
   *
   * @return {Promise} Promise that resolves with null or the contents from
   * .gitignore
   */
  getGitIgnoreIfExists() {
    const gitignorePath = join(this.projectDir, '.gitignore');

    return pathExists(gitignorePath).then((doesExist) => {
      if (!doesExist) return null;

      return readFile(gitignorePath).then(contents => contents.toString());
    });
  }

  /**
   * Parse out any custom contents from the .gitignore file
   *
   * @param {String} fileContents The contents .gitignore
   *
   * @return {String} The custom contents of .gitignore
   */
  getCustomFromGitIgnore(fileContents) {
    const parts = fileContents.split('# Project Specific\n');

    return parts[1] ? parts[1].trim() : '';
  }
}

export default GitIgnore;
