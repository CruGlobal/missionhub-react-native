import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import ContactHeader from '../src/components/ContactHeader';
import { testSnapshot } from '../testUtils';
import { Provider } from 'react-redux';
import { createMockStore } from '../testUtils/index';
const mockState = {
  steps: {
    mine: [],
  },
};

const store = createMockStore(mockState);

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactHeader name="Ben" />
    </Provider>
  );
});
