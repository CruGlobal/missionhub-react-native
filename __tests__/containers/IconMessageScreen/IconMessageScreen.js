import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import IconMessageScreen from '../../../src/containers/IconMessageScreen/index';
import { Provider } from 'react-redux';

jest.mock('react-native-device-info');

const store = {
  getState: jest.fn(() => ({
    profile: {},
    stages: {},
  })),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
};

const renderAndTest = (mainText, buttonText, iconPath) => {
  const tree = renderer.create(
    <Provider store={store}>
      <IconMessageScreen mainText={mainText} buttonText={buttonText} iconPath={iconPath} />
    </Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
};

it('renders main text correctly', () => {
  renderAndTest('Hello, world!');
});

it('renders button text correctly', () => {
  renderAndTest(null, 'Click me');
});

it('renders icon correctly', () => {
  renderAndTest(null, null, require('../../../assets/images/footprints.png'));
});
