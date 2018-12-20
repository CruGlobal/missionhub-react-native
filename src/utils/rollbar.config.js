import { Client, Configuration } from 'rollbar-react-native';
import Config from 'react-native-config';
import { Platform } from 'react-native';

const config = new Configuration(Config.ROLLBAR_ACCESS_TOKEN, {
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: `${Config.TRAVIS_COMMIT || 'development'}.${Platform.OS}`,
      },
    },
  },
});

export const rollbar = new Client(config);
