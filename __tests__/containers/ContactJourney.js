import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import ContactJourney from '../../src/containers/ContactJourney';
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import { createMockNavState, testSnapshot } from '../../testUtils';

const mockState = {
  auth: {
    isJean: true,
  },
};

const mockPerson = {
  id: 1,
  first_name: 'ben',
  organizational_permissions: [
    { organization_id: 2 },
  ],
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactJourney person={mockPerson} navigation={createMockNavState()} />
    </Provider>
  );
});
