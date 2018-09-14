// @flow

import { readJSON, writeJSON } from 'fs-extra';
import { join } from 'path';
import SetupTemplate from '../modules/SetupTemplate';
import { version } from '../../package.json';

class ProjectJSON extends SetupTemplate {
  postSetupFiles() {
    const projectJSONPath = join(this.projectDir, 'project.json');

    return readJSON(projectJSONPath).then((projectJSON) => {
      const newJSON = Object.assign({}, projectJSON);

      newJSON.templateInitVersion = version;

      return writeJSON(projectJSONPath, newJSON, { spaces: 2 });
    });
  }
}

export default ProjectJSON;
