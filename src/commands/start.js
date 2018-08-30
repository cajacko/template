// @flow

import TemplateRunner from '../modules/TemplateRunner';

const start = (...args) => {
  const templateRunner = new TemplateRunner(...args);

  return templateRunner.start();
};

export default start;
