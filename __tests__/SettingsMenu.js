import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import { createMockStore } from '../testUtils/index';
import SettingsMenu from '../src/components/SettingsMenu';
import { testSnapshot } from '../testUtils';

const store = createMockStore();

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SettingsMenu />
    </Provider>
  );
});
