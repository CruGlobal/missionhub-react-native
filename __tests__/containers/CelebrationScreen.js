import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import CelebrationScreen from '../../src/containers/CelebrationScreen';
import { testSnapshot } from '../../testUtils';

const store = createMockStore();

jest.mock('react-native-device-info');

const mockMath = Object.create(global.Math);
mockMath.random = () => 0;
global.Math = mockMath;

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <CelebrationScreen />
    </Provider>
  );
});
