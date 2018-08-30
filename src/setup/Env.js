import SetupTemplate from '../modules/SetupTemplate';

class Env extends SetupTemplate {
  setupFiles() {
    this.fs.copyIfDoesNotExist('.env');
    this.fs.copyIfDoesNotExist('.env', '.env.local');
  }
}

export default Env;
