import { parseEnvFromJSON } from '@cajacko/template-utils';
import SetupTemplate from '../modules/SetupTemplate';
import { MOBILE_APP } from '../config/requiredEnv';

export const exampleEmail = 'example@email.com';
export const examplePassword = 'examplepassword';

class Env extends SetupTemplate {
  constructor(...args) {
    super(...args);

    this.envFile = {
      USE_LOCAL_LIBS: false,
    };
  }

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
