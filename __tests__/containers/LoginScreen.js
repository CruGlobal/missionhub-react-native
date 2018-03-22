import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import LoginScreen from '../../src/containers/LoginScreen';
import { testSnapshotShallow } from '../../testUtils';
import * as analytics from '../../src/actions/analytics';
import renderer from 'react-test-renderer';


const store = createMockStore({});

jest.mock('react-native-device-info');
jest.mock('react-native-snap-carousel');

it('renders', () => {
  testSnapshotShallow(<LoginScreen />, store);
});

it('tracks state on launch', () => {
  analytics.trackState = jest.fn();

  renderer.create(
    <Provider store={store}>
      <LoginScreen />
    </Provider>,
  );

  expect(analytics.trackState).toHaveBeenCalled();
});
