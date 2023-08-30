/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {main} from './screens/index'

AppRegistry.registerComponent(appName, () => main);
