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
