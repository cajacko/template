// Bootstrap the project and load in things in the correct order

import * as config from './src/config';
import entry from '@cajacko/lib/dist/entry';

export default entry(config);
