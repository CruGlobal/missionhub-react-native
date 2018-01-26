import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import IconMessageScreen from '../../src/containers/IconMessageScreen/index';
import { Provider } from 'react-redux';

import { createMockStore } from '../../testUtils/index';
import { testSnapshot } from '../../testUtils';

const store = createMockStore();

jest.mock('react-native-device-info');

const defaultProps = {
  mainText: '',
  buttonText: '',
  iconPath: undefined,
  onComplete: jest.fn(),
};

const renderAndTest = (props = {}) => {
  testSnapshot(
    <Provider store={store}>
      <IconMessageScreen
        {...defaultProps}
        {...props}
      />
    </Provider>
  );
};

it('renders main text correctly', () => {
  renderAndTest({ mainText: 'Hello, world!' });
});

it('renders button text correctly', () => {
  renderAndTest({ buttonText: 'Click me' });
});

it('renders icon correctly', () => {
  renderAndTest({ iconPath: require('../../assets/images/footprints.png') });
});
