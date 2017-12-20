import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import SetupPersonScreen from '../../src/containers/SetupPersonScreen';
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import { testSnapshot } from '../../testUtils';

const mockState = {
  personProfile: {
    personFirstName: '',
    personLastName: '',
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SetupPersonScreen />
    </Provider>
  );
});