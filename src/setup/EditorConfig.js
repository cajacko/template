// @flow

import SetupTemplate from '../modules/SetupTemplate';

const { MAX_LINE_LENGTH } = require('../config/general');

class EditorConfig extends SetupTemplate {
  setupFiles() {
    return this.fs.copyTmpl('.editorconfig', null, {
      maxLineLength: MAX_LINE_LENGTH,
    });
  }
}

export default EditorConfig;
