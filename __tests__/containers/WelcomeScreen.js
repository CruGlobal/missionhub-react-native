import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import {createMockStore} from '../../testUtils/index';
import WelcomeScreen from '../../src/containers/WelcomeScreen';
import {testSnapshot} from '../../testUtils';

const store = createMockStore();

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <WelcomeScreen />
    </Provider>
  );
});