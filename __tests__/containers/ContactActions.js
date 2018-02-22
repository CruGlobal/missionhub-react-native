import React from 'react';

// Note: test renderer must be required after react-native.
import { ContactActions } from '../../src/containers/ContactActions';
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import { testSnapshot } from '../../testUtils';

const store = createMockStore();

it('renders dummy view', () => {
  testSnapshot(
    <Provider store={store}>
      <ContactActions />
    </Provider>
  );
});
