import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import { createThunkStore } from '../../../../testUtils';
import { testSnapshot } from '../../../../testUtils';

import IconMessageScreen from '..';

const store = createThunkStore();

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
      <IconMessageScreen {...defaultProps} {...props} />
    </Provider>,
  );
};

it('renders main text correctly', () => {
  renderAndTest({ mainText: 'Hello, world!' });
});

it('renders button text correctly', () => {
  renderAndTest({ buttonText: 'Click me' });
});

it('renders skip button correctly', () => {
  renderAndTest({ onSkip: jest.fn() });
});

it('renders back button correctly', () => {
  renderAndTest({ onBack: jest.fn() });
});

it('renders icon correctly', () => {
  renderAndTest({
    iconPath: require('../../../../assets/images/footprints.png'),
  });
});
