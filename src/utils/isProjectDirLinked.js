// @flow

import {
  getProjectDir,
  setSettings,
  getSettings,
} from '@cajacko/template-utils';
import { IS_PROJECT_DIR_LINKED_OPTION_KEY } from '../config/general';

const getLinkSettingsPath = () =>
  getProjectDir().then(projectDir => [
    IS_PROJECT_DIR_LINKED_OPTION_KEY,
    projectDir,
  ]);

export const set = val =>
  getLinkSettingsPath().then(linkSettingsPath =>
    setSettings(val, linkSettingsPath));

export const get = () => getLinkSettingsPath().then(getSettings);
