import { Client, Configuration } from 'rollbar-react-native';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const codeVersion = `${Config.TRAVIS_COMMIT || 'development'}.${Platform.OS}`;

const config = new Configuration(Config.ROLLBAR_ACCESS_TOKEN, {
  payload: {
    appVersion: DeviceInfo.getBuildNumber(),
    codeBundleId: codeVersion,
    client: {
      javascript: {
        source_map_enabled: true,
        guess_uncaught_frames: true,
        code_version: codeVersion,
      },
    },
  },
});

export const rollbar = new Client(config);
