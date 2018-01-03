import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import ImpactScreen from '../../src/containers/ImpactScreen';
import { testSnapshot } from '../../testUtils';
import MockDate from 'mockdate';

const store = createMockStore({
  impact: {
    mine: {},
    global: {},
  },
});

jest.mock('react-native-device-info');

describe('Impact Screen', () => {
  beforeEach(() => {
    MockDate.set('2017-08-20');
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('renders correctly', () => {
    testSnapshot(
      <Provider store={store}>
        <ImpactScreen />
      </Provider>
    );
  });
});
