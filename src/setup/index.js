// @flow

import PackageJSON from './PackageJSON';
import Git from './Git';
import Eslint from './Eslint';
import Env from './Env';
import Flow from './Flow';
import Jest from './Jest';
import GitIgnore from './GitIgnore';
import Readme from './Readme';
import Prettier from './Prettier';
import VSCode from './VSCode';
import Travis from './Travis';
import Privacy from './Privacy';
import EditorConfig from './EditorConfig';
import GitAttributes from './GitAttributes';
import Changelog from './Changelog';
import JSDocs from './JSDocs';
import Babel from './Babel';
import NPMIgnore from './NPMIgnore';
import Docker from './Docker';
import ProjectJSON from './ProjectJSON';

const setupTemplates = {
  packagejson: PackageJSON,
  git: Git,
  eslint: Eslint,
  env: Env,
  flow: Flow,
  jest: Jest,
  gitignore: GitIgnore,
  readme: Readme,
  prettier: Prettier,
  vscode: VSCode,
  travis: Travis,
  privacy: Privacy,
  editorconfig: EditorConfig,
  gitattributes: GitAttributes,
  changelog: Changelog,
  jsdocs: JSDocs,
  babel: Babel,
  npmignore: NPMIgnore,
  projectjson: ProjectJSON,
  docker: Docker,
};

export default setupTemplates;
