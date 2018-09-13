import { parseEnvFromJSON } from '@cajacko/template-utils';
import SetupTemplate from '../modules/SetupTemplate';

const exampleEmail = 'example@email.com';
const examplePassword = 'examplepassword';

class Env extends SetupTemplate {
  constructor(...args) {
    super(...args);

    this.envFile = {
      // REACT_APP_SENTRY_URL: 'https://example@sentry.io/example',
      // REACT_APP_STAGING_HOSTNAME: 'dev.example.com',
      // CONTENTFUL_SPACE_ID: 'example',
      // CONTENTFUL_ACCESS_TOKEN: 'exampletoken',
      // REACT_APP_GTM: 'GTM-example',
      // REACT_APP_MAILCHIMP_SIGNUP_URL:
      //   'https://example.us4.list-manage.com/subscribe?u=example&id=example',
      // SENTRY_AUTH_TOKEN: 'exampletoken',
      // SENTRY_ORG: 'example-org',
      // SENTRY_PROJECT: 'example-project',
      USE_LOCAL_LIBS: false,
    };
  }

  setupFiles() {
    if (this.templatesUsed.includes('mobile-app')) {
      this.envFile.EXPO_USERNAME = exampleEmail;
      this.envFile.EXPO_PASSWORD = examplePassword;
    }

    const contents = parseEnvFromJSON(this.envFile);

    this.fs.writeFileIfDoesNotExist('.env', contents);
    this.fs.writeFileIfDoesNotExist('.env.local', contents);
  }
}

export default Env;
