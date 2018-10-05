/** @format */

import { AppRegistry } from 'react-native';
import entry from '@cajacko/lib/entry';
import * as config from './config';

AppRegistry.registerComponent('template', () => entry(config));
