// @flow

import MobileApp from './MobileApp';
// import Website from './Website';
import GraphQL from './GraphQL';
import NPMModule from './NPMModule';

const templates = {
  'mobile-app': MobileApp,
  graphql: GraphQL,
  // website: Website,
  'npm-module': NPMModule,
};

export default templates;
