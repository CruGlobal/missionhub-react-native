import { Client, Configuration } from 'rollbar-react-native';
import Config from 'react-native-config';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const codeVersion = `${Config.TRAVIS_COMMIT ||
  Config.COMMIT_SHA ||
  'development'}.${Platform.OS}`;

const config = new Configuration(Config.ROLLBAR_ACCESS_TOKEN || '', {
  enabled: !__DEV__,
  // @ts-ignore
  captureDeviceInfo: !__DEV__, // New feature in rollbar-react-native 0.7.0 that breaks Chrome debugging https://github.com/rollbar/rollbar-react-native/issues/101. Disabling in dev.
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
