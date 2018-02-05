import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import NotificationPrimerScreen from '../../src/containers/NotificationPrimerScreen';
import { Provider } from 'react-redux';
import { createMockStore, createMockNavState, testSnapshot } from '../../testUtils';

const store = createMockStore();

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <NotificationPrimerScreen navigation={createMockNavState({
        onComplete: jest.fn(),
      })} />
    </Provider>
  );
});