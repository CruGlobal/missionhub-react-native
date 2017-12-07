import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import GetStartedScreen from '../../src/containers/GetStartedScreen';
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import { createMockNavState, testSnapshot } from '../../testUtils';

const mockState = {
  profile: {
    firstName: 'Roger',
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <GetStartedScreen navigation={createMockNavState()} />
    </Provider>
  );
});