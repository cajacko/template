import SetupTemplate from '../modules/SetupTemplate';
import { MAX_LINE_LENGTH } from '../config/general';

class VSCode extends SetupTemplate {
  setupFiles() {
    return this.fs.copyTmpl('.vscode/settings.json', null, {
      maxLineLength: MAX_LINE_LENGTH,
    });
  }
}

export default VSCode;
