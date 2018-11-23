// @flow

import { parseEnvFromJSON } from '@cajacko/template-utils';
import SetupTemplate from '../modules/SetupTemplate';
import { MOBILE_APP } from '../config/requiredEnv';

export const exampleEmail = 'example@email.com';
export const examplePassword = 'examplepassword';

/**
 * Setup the env files
 */
class Env extends SetupTemplate {
  /**
   * Set the initial env files vars
   *
   * @param  {...any} args The args passed into the SetupTemplate
   *
   * @return {Void} No return value
   */
  constructor(...args) {
    super(...args);

    this.envFile = {
      USE_LOCAL_LIBS: false,
    };
  }

  /**
   * During the setup files step, define the env file to write
   *
   * @return {Void} No return value
   */
  setupFiles() {
    if (this.templatesUsed.includes('mobile-app')) {
      this.envFile = { ...this.envFile, ...MOBILE_APP };
    }

    const contents = parseEnvFromJSON(this.envFile);

    this.fs.writeFileIfDoesNotExist('.env', contents);
    this.fs.writeFileIfDoesNotExist('.env.local', contents);
  }
}

export default Env;
