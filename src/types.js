// @flow

import templates from './templates';

const commands = {
  start: true,
  build: true,
  deploy: true,
  init: true,
  prepare: true,
  reset: true,
  test: true,
  upgrade: true,
};

export type Command = $Keys<typeof commands>;

export type TemplateKey = $Keys<typeof templates>;
export type TemplateKeys = Array<TemplateKey>;

export type MobileAppTemplateConfig = {
  key: 'mobile-app',
  splashBackgroundColor: string,
  splashIcon: string,
  icon: string,
  name?: string,
  displayName: string,
};

export type TemplateConfig = MobileAppTemplateConfig;

export type ProjectConfig = {
  title: string,
};
