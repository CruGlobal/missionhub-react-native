import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import { createMockStore } from '../../testUtils/index';
import SetupScreen from '../../src/containers/SetupScreen';
import { testSnapshot } from '../../testUtils';

const store = createMockStore({ profile: {} });

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SetupScreen />
    </Provider>,
  );
});
