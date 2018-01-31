import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import AddSomeoneScreen from '../../src/containers/AddSomeoneScreen';
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import { testSnapshotShallow } from '../../testUtils';

const mockState = {
  notifications: { hasAsked: true },
};
const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshotShallow(
    <Provider store={store}>
      <AddSomeoneScreen />
    </Provider>
  );
});
