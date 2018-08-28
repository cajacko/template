// @flow

import watchLibIfEnabled from '../utils/watchLibIfEnabled';

const start = (commander, projectConfig, env) =>
  watchLibIfEnabled(env).then(() => {
    console.log('watching and stuff');
  });

export default start;
