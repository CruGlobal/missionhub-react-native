import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import ContactHeader from '../src/components/ContactHeader';
import { testSnapshot } from '../testUtils';
import { Provider } from 'react-redux';
import { createMockStore } from '../testUtils/index';
import { CASEY } from '../src/constants';
const mockState = {
  steps: {
    mine: [],
  },
};

const store = createMockStore(mockState);

jest.mock('NativeAnimatedHelper');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactHeader person={{ first_name: 'ben', id: 1 }} type={CASEY} />
    </Provider>
  );
});
