import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import ContactSteps from '../../src/containers/ContactSteps';
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import { createMockNavState, testSnapshot } from '../../testUtils';

const mockState = {
  steps: {
    mine: [],
  },
  swipe: {
    stepsContact: true,
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactSteps person={{ first_name: 'ben', id: 1 }} navigation={createMockNavState()} />
    </Provider>
  );
});
