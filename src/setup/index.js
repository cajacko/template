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
import Example from './Example';
import Babel from './Babel';
import NVM from './NVM';

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
  example: Example,
  babel: Babel,
  nvm: NVM,
};

export default setupTemplates;
